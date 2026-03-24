const DepreciationScheduleModel = require("../models/DepreciationScheduleModel");
const AssetModel = require("../models/AssetModel");
const AssetClassificationModel = require("../models/AssetClassificationModel");
const AssetDisposalModel = require("../models/AssetDisposalModel");
const { Parser } = require("json2csv");
const PdfPrinter = require("pdfmake");
const path = require("path");
const moment = require("moment");

const sourceDir = path.join(__dirname, "..", "..", "assets", "fonts");

const calculateDepreciationForAllEmployees = async (month, year) => {
  if (!month || !year) {
    throw new Error("Month and year are required.");
  }

  const provisionDate = moment(`${year}-${month}-01`)
    .endOf("month")
    .format("YYYY-MM-DD");
  const currentDate = moment(provisionDate);
  const daysInMonth = currentDate.daysInMonth();

  const assets = await AssetModel.findAll({
    where: { status: "active", is_depreciation_calculated: true },
    include: [
      {
        model: AssetClassificationModel,
        as: "classification",
        required: true,
      },
    ],
  });

  if (!assets.length) {
    throw new Error("No active assets found.");
  }

  for (const asset of assets) {
    const classification = asset.classification;
    const acquisitionDate = moment(asset.acquisition_date);
    const startDate = moment(provisionDate).startOf("month");

    if (acquisitionDate > startDate) {
      console.warn(
        `Skipping asset with ID ${asset.asset_id} due to future acquisition date.`
      );
      continue;
    }

    const cost = asset.acquisition_cost;
    const salvageValue = asset.residual_value || 0;
    const usefulLife = asset.useful_life || classification.default_useful_life;

    if (!usefulLife || usefulLife <= 0) {
      console.warn(
        `Skipping asset with ID ${asset.asset_id} due to invalid useful life.`
      );
      continue;
    }

    const timeDiff = currentDate.diff(acquisitionDate);
    const daysElapsed = Math.max(0, Math.floor(timeDiff / (1000 * 3600 * 24)));
    const yearsElapsed = daysElapsed / 365;

    let depreciationValues = {
      monthly_depreciation: 0,
      yearly_depreciation: 0,
      accumulated_depreciation: asset.accumulated_depreciation || 0,
      current_value: cost,
      is_depreciation_calculated: true,
      useful_life: usefulLife,
      default_dep_rate: classification.default_dep_rate || null,
    };

    if (classification.default_dep_method === "straight_line") {
      // Step 1: Initialization - Calculate base depreciation values
      const depreciableAmount = cost - salvageValue;
      const annualDepreciation = depreciableAmount / usefulLife;
      const monthlyDepreciation = annualDepreciation / 12;
      const dailyDepreciation = annualDepreciation / 365;

      let accumulatedDepreciation = 0;
      let carryingAmount = cost;
      let currentMonthlyDep = 0;
      let currentYearlyDep = 0;

      // Check if asset has been disposed
      const disposal = await AssetDisposalModel.findOne({
        where: { asset_id: asset.asset_id },
      });

      let isDisposed = false;
      let disposalDate = null;

      if (disposal) {
        disposalDate = moment(disposal.disposal_date);
        isDisposed = disposalDate.isSameOrBefore(currentDate);
      }

      // Step 2: Check if there is a change in estimate
      const schedules = await DepreciationScheduleModel.findAll({
        where: {
          asset_id: asset.asset_id,
        },
        order: [["created_at", "ASC"]], // Changed to ASC to get chronological order
      });

      let hasEstimateChange = false;
      let changeSchedule = null;
      let changeDate = null;

      // If there are multiple schedules, it means there was a change
      if (schedules && schedules.length > 1) {
        // Get the latest schedule (the one with the change)
        changeSchedule = schedules[schedules.length - 1]; 

        // Get the previous schedule (original)
        const originalSchedule = schedules[0];

        // Check if useful life or residual value changed
        if (
          changeSchedule.useful_life !== originalSchedule.useful_life ||
          changeSchedule.residual_value !== originalSchedule.residual_value
        ) {
          hasEstimateChange = true;
          changeDate = moment(changeSchedule.start_date);
        }
      }

      // Step 3: Calculate depreciation based on scenarios

      if (isDisposed) {
        // SCENARIO: Asset is disposed
        const daysUpToDisposal = disposalDate.diff(acquisitionDate, "days");

        if (hasEstimateChange && changeDate.isBefore(disposalDate)) {
          // There was a change in estimate before disposal
          const daysUpToChange = changeDate.diff(acquisitionDate, "days");

          // Accumulated depreciation up to change date (using original rate)
          const accumulatedAtChange = Math.min(
            dailyDepreciation * daysUpToChange,
            depreciableAmount
          );

          // Net Book Value at change date
          const nbvAtChange = cost - accumulatedAtChange;

          // New estimates from change schedule
          const newResidualValue = changeSchedule.residual_value;
          const newUsefulLife = changeSchedule.useful_life;

          // Years elapsed at change date
          const yearsElapsedAtChange = changeDate.diff(
            acquisitionDate,
            "years",
            true
          );

          // Remaining useful life from change date
          const remainingUsefulLife = newUsefulLife - yearsElapsedAtChange;

          if (remainingUsefulLife > 0) {
            // Calculate new depreciation rate
            const newDepreciableAmount = nbvAtChange - newResidualValue;
            const newAnnualDep = newDepreciableAmount / remainingUsefulLife;
            const newDailyDep = newAnnualDep / 365;

            // Days from change to disposal
            const daysFromChangeToDisposal = disposalDate.diff(
              changeDate,
              "days"
            );
            const depreciationSinceChange =
              newDailyDep * daysFromChangeToDisposal;

            accumulatedDepreciation =
              accumulatedAtChange + depreciationSinceChange;
          } else {
            accumulatedDepreciation = accumulatedAtChange;
          }
        } else {
          // No change in estimate, simple calculation up to disposal
          accumulatedDepreciation = Math.min(
            dailyDepreciation * daysUpToDisposal,
            depreciableAmount
          );
        }

        carryingAmount = cost - accumulatedDepreciation;

        // No more depreciation after disposal
        currentYearlyDep = 0;
        currentMonthlyDep = 0;
      } else if (hasEstimateChange && changeDate.isSameOrBefore(currentDate)) {
        // SCENARIO: There was a change in estimate and we're past that date

        const daysUpToChange = changeDate.diff(acquisitionDate, "days");

        // Accumulated depreciation UP TO the change date (using original rate)
        const accumulatedAtChange = Math.min(
          dailyDepreciation * daysUpToChange,
          depreciableAmount
        );

        // Net Book Value at change date
        const nbvAtChange = cost - accumulatedAtChange;

        // Get new estimates from the change schedule
        const newUsefulLife = changeSchedule.useful_life;
        const newResidualValue = changeSchedule.residual_value;

        // Calculate how many years had elapsed at the change date
        const yearsElapsedAtChange = changeDate.diff(
          acquisitionDate,
          "years",
          true
        );

        // Calculate remaining useful life from change date
        const remainingUsefulLife = newUsefulLife - yearsElapsedAtChange;

        if (remainingUsefulLife > 0) {
          // Recalculate depreciation based on:
          // New Depreciable Amount = NBV at change - New Residual Value
          // New Annual Depreciation = New Depreciable Amount / Remaining Life

          const newDepreciableAmount = nbvAtChange - newResidualValue;
          const newAnnualDep = newDepreciableAmount / remainingUsefulLife;
          const newDailyDep = newAnnualDep / 365;
          const newMonthlyDep = newAnnualDep / 12;

          // Calculate depreciation from change date to current date
          const daysFromChange = currentDate.diff(changeDate, "days");
          const depreciationSinceChange = newDailyDep * daysFromChange;

          // Total accumulated depreciation =
          // Depreciation up to change + Depreciation since change
          accumulatedDepreciation =
            accumulatedAtChange + depreciationSinceChange;

          // Ensure we don't go below new residual value
          const maxAccumulatedDep = cost - newResidualValue;
          accumulatedDepreciation = Math.min(
            accumulatedDepreciation,
            maxAccumulatedDep
          );

          carryingAmount = cost - accumulatedDepreciation;

          // Current period depreciation rates (for the month being calculated)
          currentYearlyDep = newAnnualDep;
          currentMonthlyDep = newMonthlyDep;
        } else {
          // Useful life has expired at or before change date - no more depreciation
          accumulatedDepreciation = Math.min(
            accumulatedAtChange,
            cost - newResidualValue
          );
          carryingAmount = cost - accumulatedDepreciation;
          currentYearlyDep = 0;
          currentMonthlyDep = 0;
        }
      } else {
        // SCENARIO: No change in estimate, standard straight-line calculation

        const daysFromAcquisition = currentDate.diff(acquisitionDate, "days");

        // Calculate accumulated depreciation from acquisition to current date
        accumulatedDepreciation = Math.min(
          dailyDepreciation * daysFromAcquisition,
          depreciableAmount
        );

        carryingAmount = cost - accumulatedDepreciation;

        // Check if asset has exceeded useful life
        const yearsElapsedFromAcquisition = currentDate.diff(
          acquisitionDate,
          "years",
          true
        );

        if (yearsElapsedFromAcquisition >= usefulLife) {
          // Asset has reached end of useful life
          currentYearlyDep = 0;
          currentMonthlyDep = 0;
        } else {
          // Asset is still depreciating
          currentYearlyDep = annualDepreciation;
          currentMonthlyDep = monthlyDepreciation;
        }
      }

      // Set final values
      depreciationValues = {
        ...depreciationValues,
        monthly_depreciation: parseFloat(currentMonthlyDep.toFixed(2)),
        yearly_depreciation: parseFloat(currentYearlyDep.toFixed(2)),
        accumulated_depreciation: parseFloat(
          accumulatedDepreciation.toFixed(2)
        ),
        current_value: parseFloat(carryingAmount.toFixed(2)),
      };
    } 
    else if (classification.default_dep_method === "declining_balance") {
      // Step 1: Initialization - Calculate double-declining rate
      const ddbRate = (2 / usefulLife) * 100; // Convert to percentage

      // Initialize variables
      let accumulatedDepreciation = 0;
      let carryingAmount = cost;
      let currentYearlyDep = 0;
      let currentMonthlyDep = 0;

      // Check if asset has been disposed
      const disposal = await AssetDisposalModel.findOne({
        where: { asset_id: asset.asset_id },
      });

      let isDisposed = false;
      let disposalDate = null;

      if (disposal) {
        disposalDate = moment(disposal.disposal_date);
        isDisposed = disposalDate.isSameOrBefore(currentDate);
      }

      // Step 2: Check if there is a change in estimate
      const schedules = await DepreciationScheduleModel.findAll({
        where: {
          asset_id: asset.asset_id,
        },
        order: [["created_at", "ASC"]],
      });

      let hasEstimateChange = false;
      let changeSchedule = null;
      let changeDate = null;

      // If there are multiple schedules, it means there was a change
      if (schedules && schedules.length > 1) {
        // Get the latest schedule (the one with the change)
        changeSchedule = schedules[schedules.length - 1];
        const originalSchedule = schedules[0];

        // Check if useful life or residual value changed
        if (
          changeSchedule.useful_life !== originalSchedule.useful_life ||
          changeSchedule.residual_value !== originalSchedule.residual_value
        ) {
          hasEstimateChange = true;
          changeDate = moment(changeSchedule.start_date);
        }
      }

      // Step 3: Calculate depreciation based on scenarios

      if (isDisposed) {
        // SCENARIO: Asset is disposed
        const yearsUpToDisposal = disposalDate.diff(
          acquisitionDate,
          "years",
          true
        );

        if (hasEstimateChange && changeDate.isBefore(disposalDate)) {
          // There was a change in estimate before disposal
          const yearsUpToChange = changeDate.diff(
            acquisitionDate,
            "years",
            true
          );

          // Calculate accumulated depreciation up to change date
          let remainingBookValue = cost;

          // Depreciate year by year until change date using original DDB rate
          for (let year = 0; year < Math.floor(yearsUpToChange); year++) {
            let yearlyDep = remainingBookValue * (ddbRate / 100);
            if (remainingBookValue - yearlyDep < salvageValue) {
              yearlyDep = remainingBookValue - salvageValue;
            }
            accumulatedDepreciation += yearlyDep;
            remainingBookValue -= yearlyDep;
            if (remainingBookValue <= salvageValue) {
              break;
            }
          }

          // Handle partial year up to change using original DDB rate
          const partialYearToChange =
            yearsUpToChange - Math.floor(yearsUpToChange);
          if (partialYearToChange > 0 && remainingBookValue > salvageValue) {
            let partialYearDep =
              remainingBookValue * (ddbRate / 100) * partialYearToChange;
            if (remainingBookValue - partialYearDep < salvageValue) {
              partialYearDep = remainingBookValue - salvageValue;
            }
            accumulatedDepreciation += partialYearDep;
            remainingBookValue -= partialYearDep;
          }

          // Net Book Value at change date
          const nbvAtChange = remainingBookValue;

          // Get new estimates
          const newUsefulLife = changeSchedule.useful_life;
          const newResidualValue = changeSchedule.residual_value;
          const yearsElapsedAtChange = yearsUpToChange;
          const remainingUsefulLife = newUsefulLife - yearsElapsedAtChange;

          if (remainingUsefulLife > 0) {
            // Calculate new DDB rate
            const newRate = (2 / remainingUsefulLife) * 100;

            // Calculate years from change to disposal
            const yearsFromChangeToDisposal = disposalDate.diff(
              changeDate,
              "years",
              true
            );

            // Depreciate from change date to disposal with new rate
            let currentBookValue = nbvAtChange;

            for (
              let year = 0;
              year < Math.floor(yearsFromChangeToDisposal);
              year++
            ) {
              let yearlyDep = currentBookValue * (newRate / 100);
              if (currentBookValue - yearlyDep < newResidualValue) {
                yearlyDep = currentBookValue - newResidualValue;
              }
              accumulatedDepreciation += yearlyDep;
              currentBookValue -= yearlyDep;
              if (currentBookValue <= newResidualValue) {
                break;
              }
            }

            // Handle partial year from change to disposal
            const partialYearToDisposal =
              yearsFromChangeToDisposal - Math.floor(yearsFromChangeToDisposal);
            if (
              partialYearToDisposal > 0 &&
              currentBookValue > newResidualValue
            ) {
              let partialYearDep =
                currentBookValue * (newRate / 100) * partialYearToDisposal;
              if (currentBookValue - partialYearDep < newResidualValue) {
                partialYearDep = currentBookValue - newResidualValue;
              }
              accumulatedDepreciation += partialYearDep;
            }
          }
        } else {
          // No change in estimate - simple calculation up to disposal using DDB rate
          let remainingBookValue = cost;

          for (let year = 0; year < Math.floor(yearsUpToDisposal); year++) {
            let yearlyDep = remainingBookValue * (ddbRate / 100);
            if (remainingBookValue - yearlyDep < salvageValue) {
              yearlyDep = remainingBookValue - salvageValue;
            }
            accumulatedDepreciation += yearlyDep;
            remainingBookValue -= yearlyDep;
            if (remainingBookValue <= salvageValue) {
              break;
            }
          }

          const partialYear = yearsUpToDisposal - Math.floor(yearsUpToDisposal);
          if (partialYear > 0 && remainingBookValue > salvageValue) {
            let partialYearDep =
              remainingBookValue * (ddbRate / 100) * partialYear;
            if (remainingBookValue - partialYearDep < salvageValue) {
              partialYearDep = remainingBookValue - salvageValue;
            }
            accumulatedDepreciation += partialYearDep;
          }
        }

        carryingAmount = cost - accumulatedDepreciation;

        // No more depreciation after disposal
        currentYearlyDep = 0;
        currentMonthlyDep = 0;
      } else if (hasEstimateChange && changeDate.isSameOrBefore(currentDate)) {
        // SCENARIO: There was a change in estimate and we're past that date

        const yearsUpToChange = changeDate.diff(acquisitionDate, "years", true);

        // Calculate accumulated depreciation UP TO the change date (using original DDB rate)
        let remainingBookValue = cost;

        for (let year = 0; year < Math.floor(yearsUpToChange); year++) {
          let yearlyDep = remainingBookValue * (ddbRate / 100);
          if (remainingBookValue - yearlyDep < salvageValue) {
            yearlyDep = remainingBookValue - salvageValue;
          }
          accumulatedDepreciation += yearlyDep;
          remainingBookValue -= yearlyDep;
          if (remainingBookValue <= salvageValue) {
            break;
          }
        }

        const partialYearToChange =
          yearsUpToChange - Math.floor(yearsUpToChange);
        if (partialYearToChange > 0 && remainingBookValue > salvageValue) {
          let partialYearDep =
            remainingBookValue * (ddbRate / 100) * partialYearToChange;
          if (remainingBookValue - partialYearDep < salvageValue) {
            partialYearDep = remainingBookValue - salvageValue;
          }
          accumulatedDepreciation += partialYearDep;
          remainingBookValue -= partialYearDep;
        }

        // Net Book Value at change date
        const nbvAtChange = remainingBookValue;

        // Get new estimates from the change schedule
        const newUsefulLife = changeSchedule.useful_life;
        const newResidualValue = changeSchedule.residual_value;

        // Calculate how many years had elapsed at the change date
        const yearsElapsedAtChange = yearsUpToChange;

        // Calculate remaining useful life from change date
        const remainingUsefulLife = newUsefulLife - yearsElapsedAtChange;

        if (remainingUsefulLife > 0) {
          // Recalculate DDB rate based on remaining useful life
          const newRate = (2 / remainingUsefulLife) * 100;

          // Calculate depreciation from change date to current date
          const yearsFromChange = currentDate.diff(changeDate, "years", true);

          let currentBookValue = nbvAtChange;

          for (let year = 0; year < Math.floor(yearsFromChange); year++) {
            let yearlyDep = currentBookValue * (newRate / 100);
            if (currentBookValue - yearlyDep < newResidualValue) {
              yearlyDep = currentBookValue - newResidualValue;
            }
            accumulatedDepreciation += yearlyDep;
            currentBookValue -= yearlyDep;
            if (currentBookValue <= newResidualValue) {
              break;
            }
          }

          const partialYearFromChange =
            yearsFromChange - Math.floor(yearsFromChange);
          if (
            partialYearFromChange > 0 &&
            currentBookValue > newResidualValue
          ) {
            let partialYearDep =
              currentBookValue * (newRate / 100) * partialYearFromChange;
            if (currentBookValue - partialYearDep < newResidualValue) {
              partialYearDep = currentBookValue - newResidualValue;
            }
            accumulatedDepreciation += partialYearDep;
            currentBookValue -= partialYearDep;
          }

          carryingAmount = cost - accumulatedDepreciation;

          // Current period depreciation rates
          if (currentBookValue > newResidualValue) {
            currentYearlyDep = currentBookValue * (newRate / 100);
            if (currentBookValue - currentYearlyDep < newResidualValue) {
              currentYearlyDep = currentBookValue - newResidualValue;
            }
            const dailyDep = currentYearlyDep / 365;
            currentMonthlyDep = dailyDep * daysInMonth;
          } else {
            currentYearlyDep = 0;
            currentMonthlyDep = 0;
          }
        } else {
          // Useful life has expired
          carryingAmount = Math.max(nbvAtChange, newResidualValue);
          accumulatedDepreciation = cost - carryingAmount;
          currentYearlyDep = 0;
          currentMonthlyDep = 0;
        }
      } else {
        // SCENARIO: No change in estimate, standard DDB calculation

        let remainingBookValue = cost;

        for (let year = 0; year < Math.floor(yearsElapsed); year++) {
          let yearlyDep = remainingBookValue * (ddbRate / 100);
          if (remainingBookValue - yearlyDep < salvageValue) {
            yearlyDep = remainingBookValue - salvageValue;
          }
          accumulatedDepreciation += yearlyDep;
          remainingBookValue -= yearlyDep;
          if (remainingBookValue <= salvageValue) {
            break;
          }
        }

        const partialYear = yearsElapsed - Math.floor(yearsElapsed);
        if (partialYear > 0 && remainingBookValue > salvageValue) {
          let partialYearDep =
            remainingBookValue * (ddbRate / 100) * partialYear;
          if (remainingBookValue - partialYearDep < salvageValue) {
            partialYearDep = remainingBookValue - salvageValue;
          }
          accumulatedDepreciation += partialYearDep;
          remainingBookValue -= partialYearDep;
        }

        carryingAmount = cost - accumulatedDepreciation;

        // Calculate current period depreciation using DDB rate
        if (remainingBookValue > salvageValue && yearsElapsed < usefulLife) {
          currentYearlyDep = remainingBookValue * (ddbRate / 100);
          if (remainingBookValue - currentYearlyDep < salvageValue) {
            currentYearlyDep = remainingBookValue - salvageValue;
          }
          const dailyDep = currentYearlyDep / 365;
          currentMonthlyDep = dailyDep * daysInMonth;
        } else {
          currentYearlyDep = 0;
          currentMonthlyDep = 0;
        }
      }

      // Set final values
      depreciationValues = {
        monthly_depreciation: parseFloat(currentMonthlyDep.toFixed(2)),
        yearly_depreciation: parseFloat(currentYearlyDep.toFixed(2)),
        accumulated_depreciation: parseFloat(
          accumulatedDepreciation.toFixed(2)
        ),
        current_value: parseFloat(carryingAmount.toFixed(2)),
        is_depreciation_calculated: true,
        useful_life: usefulLife,
        default_dep_rate: parseFloat(ddbRate.toFixed(2)), // Store the calculated DDB rate
      };
    }
    else if (classification.default_dep_method === "units_of_production") {
      // Step 1: Initialization
      const totalEstimatedUnits = usefulLife; // Using useful_life field to store total estimated units

      if (!totalEstimatedUnits || totalEstimatedUnits <= 0) {
        console.warn(
          `Skipping asset with ID ${asset.asset_id} due to invalid total estimated units.`
        );
        continue;
      }

      // Initialize variables
      const depreciableAmount = cost - salvageValue;
      const ratePerUnit = depreciableAmount / totalEstimatedUnits;

      let accumulatedDepreciation = 0;
      let carryingAmount = cost;
      let currentPeriodDepreciation = 0;
      let currentRatePerUnit = ratePerUnit;

      // Check if asset has been disposed
      const disposal = await AssetDisposalModel.findOne({
        where: { asset_id: asset.asset_id },
      });

      let isDisposed = false;
      let disposalDate = null;

      if (disposal) {
        disposalDate = moment(disposal.disposal_date);
        isDisposed = disposalDate.isSameOrBefore(currentDate);
      }

      // Step 2: Check if there is a change in estimate
      const schedules = await DepreciationScheduleModel.findAll({
        where: { asset_id: asset.asset_id },
        order: [["created_at", "ASC"]],
      });

      let hasEstimateChange = false;
      let changeSchedule = null;
      let changeDate = null;

      if (schedules && schedules.length > 1) {
        changeSchedule = schedules[schedules.length - 1];
        const originalSchedule = schedules[0];

        // Check if total estimated units, useful life, or residual value changed
        if (
          changeSchedule.total_estimated_units !==
            originalSchedule.total_estimated_units ||
          changeSchedule.useful_life !== originalSchedule.useful_life ||
          changeSchedule.residual_value !== originalSchedule.residual_value
        ) {
          hasEstimateChange = true;
          changeDate = moment(changeSchedule.start_date);
        }
      }

      // Get actual usage data up to current date
      let actualUsageToDate = 0;

      if (
        asset.accumulated_depreciation &&
        asset.accumulated_depreciation > 0
      ) {
        // Calculate actual usage from current accumulated depreciation
        actualUsageToDate = Math.floor(
          asset.accumulated_depreciation / ratePerUnit
        );
      }

      let currentPeriodUsage = 0; 

      // Step 3: Calculate depreciation based on scenarios

      if (isDisposed) {
        // SCENARIO: Asset is disposed - stop depreciation

        if (hasEstimateChange && changeDate.isBefore(disposalDate)) {
          // Calculate usage up to change date
          const usageAtChange = actualUsageToDate; // Should be calculated from records up to change date

          // Accumulated depreciation up to change (using original rate)
          const accumulatedAtChange = Math.min(
            usageAtChange * ratePerUnit,
            depreciableAmount
          );

          // Net Book Value at change date
          const nbvAtChange = cost - accumulatedAtChange;

          // New estimates
          const newTotalEstimatedUnits =
            changeSchedule.total_estimated_units || totalEstimatedUnits;
          const newResidualValue = changeSchedule.residual_value;

          // Calculate remaining units after change
          const remainingUnits = newTotalEstimatedUnits - usageAtChange;

          if (remainingUnits > 0) {
            // Recalculate rate per unit
            const newDepreciableAmount = nbvAtChange - newResidualValue;
            const newRatePerUnit = newDepreciableAmount / remainingUnits;

            // Calculate usage from change to disposal
            const usageFromChangeToDisposal = actualUsageToDate - usageAtChange;
            const depreciationSinceChange =
              usageFromChangeToDisposal * newRatePerUnit;

            accumulatedDepreciation =
              accumulatedAtChange + depreciationSinceChange;
          } else {
            accumulatedDepreciation = accumulatedAtChange;
          }
        } else {
          // No change in estimate - simple calculation
          accumulatedDepreciation = Math.min(
            actualUsageToDate * ratePerUnit,
            depreciableAmount
          );
        }

        carryingAmount = cost - accumulatedDepreciation;
        currentPeriodDepreciation = 0;
        currentRatePerUnit = 0;
      } else if (hasEstimateChange && changeDate.isSameOrBefore(currentDate)) {
        // SCENARIO: Change in estimate occurred

        // Calculate usage up to change date (should come from usage records)
        const usageAtChange = actualUsageToDate; 

        // Accumulated depreciation UP TO change date (using original rate)
        const accumulatedAtChange = Math.min(
          usageAtChange * ratePerUnit,
          depreciableAmount
        );

        // Net Book Value at change date
        const nbvAtChange = cost - accumulatedAtChange;

        // Get new estimates
        const newTotalEstimatedUnits =
          changeSchedule.total_estimated_units || totalEstimatedUnits;
        const newResidualValue = changeSchedule.residual_value;

        // Check if we've exceeded original useful life
        if (actualUsageToDate >= totalEstimatedUnits) {
          // Condition 3: Change AFTER useful life
          // We've exceeded the original estimated units

          const additionalDepreciableAmount = nbvAtChange - newResidualValue;
          const additionalUnits = newTotalEstimatedUnits - actualUsageToDate;

          if (additionalUnits > 0) {
            currentRatePerUnit = additionalDepreciableAmount / additionalUnits;

            // Calculate depreciation from change to now
            const usageSinceChange = actualUsageToDate - usageAtChange;
            const depreciationSinceChange =
              usageSinceChange * currentRatePerUnit;

            accumulatedDepreciation =
              accumulatedAtChange + depreciationSinceChange;
            carryingAmount = cost - accumulatedDepreciation;

            // Current period depreciation
            currentPeriodDepreciation = currentPeriodUsage * currentRatePerUnit;
          } else {
            accumulatedDepreciation = Math.min(
              accumulatedAtChange,
              cost - newResidualValue
            );
            carryingAmount = cost - accumulatedDepreciation;
            currentPeriodDepreciation = 0;
            currentRatePerUnit = 0;
          }
        } else {
          // Condition 1 or 2: Change DURING useful life

          // Calculate remaining units from change date
          const remainingUnits = newTotalEstimatedUnits - actualUsageToDate;

          if (remainingUnits > 0) {
            // Recalculate depreciation rate
            const newDepreciableAmount = nbvAtChange - newResidualValue;
            currentRatePerUnit = newDepreciableAmount / remainingUnits;

            // Calculate depreciation from change date to current date
            const usageSinceChange = actualUsageToDate - usageAtChange;
            const depreciationSinceChange =
              usageSinceChange * currentRatePerUnit;

            accumulatedDepreciation =
              accumulatedAtChange + depreciationSinceChange;

            // Ensure we don't exceed max depreciation
            const maxAccumulatedDep = cost - newResidualValue;
            accumulatedDepreciation = Math.min(
              accumulatedDepreciation,
              maxAccumulatedDep
            );

            carryingAmount = cost - accumulatedDepreciation;

            // Current period depreciation
            currentPeriodDepreciation = currentPeriodUsage * currentRatePerUnit;
          } else {
            // Useful life exhausted
            accumulatedDepreciation = Math.min(
              accumulatedAtChange,
              cost - newResidualValue
            );
            carryingAmount = cost - accumulatedDepreciation;
            currentPeriodDepreciation = 0;
            currentRatePerUnit = 0;
          }
        }
      } else {
        // SCENARIO: No change in estimate - standard UOP calculation

        // Calculate accumulated depreciation from acquisition to current date
        accumulatedDepreciation = Math.min(
          actualUsageToDate * ratePerUnit,
          depreciableAmount
        );

        carryingAmount = cost - accumulatedDepreciation;

        // Check if asset has exceeded useful life (total estimated units)
        if (actualUsageToDate >= totalEstimatedUnits) {
          // Asset has reached end of useful life
          currentPeriodDepreciation = 0;
          currentRatePerUnit = 0;
        } else {
          // Asset is still depreciating
          currentPeriodDepreciation = currentPeriodUsage * ratePerUnit;
        }
      }

      // If current period usage is available, use it; otherwise estimate
      const estimatedAnnualUsage =
        currentPeriodUsage > 0
          ? currentPeriodUsage * 12
          : totalEstimatedUnits / (usefulLife || 10); // Fallback estimation

      const yearlyDepreciation = currentRatePerUnit * estimatedAnnualUsage;
      const monthlyDepreciation =
        currentPeriodDepreciation || yearlyDepreciation / 12;

      // Set final values
      depreciationValues = {
        ...depreciationValues,
        monthly_depreciation: parseFloat(monthlyDepreciation.toFixed(2)),
        yearly_depreciation: parseFloat(yearlyDepreciation.toFixed(2)),
        accumulated_depreciation: parseFloat(
          accumulatedDepreciation.toFixed(2)
        ),
        current_value: parseFloat(carryingAmount.toFixed(2)),
        default_dep_rate: parseFloat(currentRatePerUnit.toFixed(4)),
      };
    }

    await AssetModel.update(
      {
        monthly_depreciation: depreciationValues.monthly_depreciation,
        yearly_depreciation: depreciationValues.yearly_depreciation,
        accumulated_depreciation: depreciationValues.accumulated_depreciation,
        current_value: depreciationValues.current_value,
        useful_life: depreciationValues.useful_life,
        default_dep_rate: depreciationValues.default_dep_rate,
      },
      { where: { asset_id: asset.asset_id } }
    );

    await DepreciationScheduleModel.upsert({
      asset_id: asset.asset_id,
      dep_method: classification.default_dep_method,
      dep_rate: depreciationValues.default_dep_rate || 0,
      useful_life: usefulLife,
      total_estimated_units:
        classification.default_dep_method === "units_of_production"
          ? usefulLife
          : null,
      start_date: moment(provisionDate).startOf("month").format("YYYY-MM-DD"),
      end_date: moment(provisionDate)
        .startOf("month")
        .add(5, "years")
        .endOf("day")
        .format("YYYY-MM-DD"),
      original_cost: cost,
      residual_value: salvageValue,
      accumulated_depreciation: depreciationValues.accumulated_depreciation,
      yearly_depreciation: depreciationValues.yearly_depreciation,
      monthly_depreciation: depreciationValues.monthly_depreciation,
      is_active: true,
      approval_status: "Pending",
    });
  }

  return `Depreciation calculated for ${assets.length} assets for ${month}/${year}.`;
};

const calculateDepreciationForAllEmployeesHandler = async (req, res) => {
  const { month, year } = req.body;

  if (!month || !year) {
    return res.status(400).json({ message: "Month and year are required." });
  }

  try {
    const message = await calculateDepreciationForAllEmployees(month, year);
    return res.status(200).json({ message });
  } catch (error) {
    console.error("Depreciation calculation error:", error);
    return res
      .status(500)
      .json({ message: error.message || "Internal server error." });
  }
};

const approveDepreciationSchedule = async (req, res) => {
  const { schedule_id } = req.params;

  try {
    const schedule = await DepreciationScheduleModel.findByPk(schedule_id);
    if (!schedule) {
      return res
        .status(404)
        .json({ message: "Depreciation schedule not found" });
    }

    await schedule.update({ approval_status: "Approved" });
    res.status(200).json({
      message: "Depreciation schedule approved successfully",
      schedule,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error approving depreciation schedule",
      error: error.message,
    });
  }
};

const rejectDepreciationSchedule = async (req, res) => {
  const { schedule_id } = req.params;

  try {
    const schedule = await DepreciationScheduleModel.findByPk(schedule_id);
    if (!schedule) {
      return res
        .status(404)
        .json({ message: "Depreciation schedule not found" });
    }

    await schedule.update({ approval_status: "Rejected" });
    res.status(200).json({
      message: "Depreciation schedule rejected successfully",
      schedule,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error rejecting depreciation schedule",
      error: error.message,
    });
  }
};

const updateDepreciationSchedule = async (req, res) => {
  const { schedule_id } = req.params;
  const {
    dep_method,
    dep_rate,
    start_date,
    original_cost,
    residual_value,
    accumulated_depreciation,
    yearly_depreciation,
    monthly_depreciation,
    is_active,
  } = req.body;

  try {
    const schedule = await DepreciationScheduleModel.findByPk(schedule_id);
    if (!schedule) {
      return res
        .status(404)
        .json({ message: "Depreciation schedule not found" });
    }

    // Validation
    if (
      dep_method &&
      ![
        "straight_line",
        "declining_balance",
        "double_declining_balance",
        "units_of_production",
      ].includes(dep_method)
    ) {
      return res.status(400).json({ message: "Invalid depreciation method" });
    }
    if (residual_value && original_cost && residual_value >= original_cost) {
      return res
        .status(400)
        .json({ message: "Residual value must be less than original cost" });
    }

    // Calculate end_date based on start_date
    let endDate;
    if (start_date) {
      const startDate = moment(start_date).startOf("day");
      if (!startDate.isValid()) {
        return res.status(400).json({ message: "Invalid start date" });
      }
      endDate = startDate.clone().add(5, "years").endOf("day");
    }

    await schedule.update({
      dep_method: dep_method || schedule.dep_method,
      dep_rate: dep_rate || schedule.dep_rate,
      start_date: start_date || schedule.start_date,
      end_date: start_date ? endDate.format("YYYY-MM-DD") : schedule.end_date,
      original_cost: original_cost || schedule.original_cost,
      residual_value: residual_value || schedule.residual_value,
      accumulated_depreciation:
        accumulated_depreciation || schedule.accumulated_depreciation,
      yearly_depreciation: yearly_depreciation || schedule.yearly_depreciation,
      monthly_depreciation:
        monthly_depreciation || schedule.monthly_depreciation,
      is_active: is_active !== undefined ? is_active : schedule.is_active,
    });

    res.status(200).json({
      message: "Depreciation schedule updated successfully",
      schedule,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating depreciation schedule",
      error: error.message,
    });
  }
};

const deleteDepreciationSchedule = async (req, res) => {
  const { schedule_id } = req.params;

  try {
    const schedule = await DepreciationScheduleModel.findByPk(schedule_id);
    if (!schedule) {
      return res
        .status(404)
        .json({ message: "Depreciation schedule not found" });
    }

    await schedule.destroy();
    res
      .status(200)
      .json({ message: "Depreciation schedule deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting depreciation schedule",
      error: error.message,
    });
  }
};

const getDepreciationScheduleById = async (req, res) => {
  try {
    const { schedule_id } = req.params;
    const schedule = await DepreciationScheduleModel.findByPk(schedule_id, {
      include: [{ model: AssetModel, as: "Asset" }],
    });
    if (!schedule) {
      return res
        .status(404)
        .json({ message: "Depreciation schedule not found" });
    }
    res.status(200).json(schedule);
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving depreciation schedule",
      error: error.message,
    });
  }
};

const getAllDepreciationSchedules = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const { count: totalSchedules, rows: schedules } =
      await DepreciationScheduleModel.findAndCountAll({
        offset,
        limit: parseInt(limit),
        include: [{ model: AssetModel, as: "Asset" }],
      });

    res.status(200).json({
      totalSchedules,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalSchedules / limit),
      schedules,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving depreciation schedules",
      error: error.message,
    });
  }
};

const exportDepreciationSchedulesToCSV = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const schedules = await DepreciationScheduleModel.findAll({
      offset,
      limit: parseInt(limit),
      include: [{ model: AssetModel, as: "Asset" }],
    });

    if (!schedules || schedules.length === 0) {
      return res
        .status(404)
        .json({ message: "No depreciation schedules found" });
    }

    const scheduleData = schedules.map((schedule) => ({
      schedule_id: schedule.schedule_id,
      asset_id: schedule.asset_id,
      description: schedule.Asset?.description || "N/A",
      dep_method: schedule.dep_method,
      start_date: schedule.start_date,
      end_date: schedule.end_date,
      original_cost: schedule.original_cost,
      residual_value: schedule.residual_value,
      accumulated_depreciation: schedule.accumulated_depreciation,
      yearly_depreciation: schedule.yearly_depreciation,
      monthly_depreciation: schedule.monthly_depreciation,
    }));

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(scheduleData);

    res.header("Content-Type", "text/csv");
    res.attachment("depreciation_schedules.csv");
    res.send(csv);
  } catch (error) {
    res.status(500).json({
      message: "Error exporting depreciation schedules to CSV",
      error: error.message,
    });
  }
};

const exportDepreciationSchedulesToPDF = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const schedules = await DepreciationScheduleModel.findAll({
      offset,
      limit: parseInt(limit),
      include: [{ model: AssetModel, as: "Asset" }],
    });

    if (!schedules || schedules.length === 0) {
      return res
        .status(404)
        .json({ message: "No depreciation schedules found" });
    }

    const scheduleData = schedules.map((schedule) => [
      schedule.schedule_id || "N/A",
      schedule.asset_id || "N/A",
      schedule.Asset?.description || "N/A",
      schedule.dep_method || "N/A",
      schedule.start_date || "N/A",
      schedule.end_date || "N/A",
      schedule.original_cost?.toFixed(2) || "0.00",
      schedule.residual_value?.toFixed(2) || "0.00",
      schedule.accumulated_depreciation?.toFixed(2) || "0.00",
      schedule.yearly_depreciation?.toFixed(2) || "0.00",
      schedule.monthly_depreciation?.toFixed(2) || "0.00",
    ]);

    const docDefinition = {
      content: [
        { text: "Depreciation Schedules", style: "header" },
        {
          table: {
            headerRows: 1,
            widths: [
              "auto",
              "auto",
              "*",
              "auto",
              "auto",
              "auto",
              "auto",
              "auto",
              "auto",
              "auto",
              "auto",
            ],
            body: [
              [
                "Schedule ID",
                "Asset ID",
                "Description",
                "Dep. Method",
                "Start Date",
                "End Date",
                "Original Cost",
                "Residual Value",
                "Accum. Dep.",
                "Yearly Dep.",
                "Monthly Dep.",
              ],
              ...scheduleData,
            ],
          },
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          alignment: "center",
          margin: [0, 0, 0, 20],
        },
      },
      defaultStyle: {
        fontSize: 8,
      },
    };

    const printer = new PdfPrinter({
      Roboto: {
        normal: path.join(sourceDir, "Roboto-Regular.ttf"),
        bold: path.join(sourceDir, "Roboto-Medium.ttf"),
        italics: path.join(sourceDir, "Roboto-Italic.ttf"),
        bolditalics: path.join(sourceDir, "Roboto-MediumItalic.ttf"),
      },
    });

    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    res.header("Content-Type", "application/pdf");
    res.attachment("depreciation_schedules.pdf");
    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (error) {
    res.status(500).json({
      message: "Error exporting depreciation schedules to PDF",
      error: error.message,
    });
  }
};

module.exports = {
  calculateDepreciationForAllEmployees,
  calculateDepreciationForAllEmployeesHandler,
  approveDepreciationSchedule,
  rejectDepreciationSchedule,
  updateDepreciationSchedule,
  deleteDepreciationSchedule,
  getDepreciationScheduleById,
  getAllDepreciationSchedules,
  exportDepreciationSchedulesToCSV,
  exportDepreciationSchedulesToPDF,
};
