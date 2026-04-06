const bcrypt = require("bcrypt");
const sequelize = require("../config/dbSync");
const CheckPermission = require("../models/CheckPermissionsModel");
const GroupRoles = require("../models/GroupRolesModel");
const Groups = require("../models/GroupsModel");
const LoginHistories = require("../models/LoginHistoriesModel");
const LoginMFA = require("../models/LoginMFAModel");
const LoginSSO = require("../models/LoginSSOModel");
const LoginStatuses = require("../models/LoginStatusesModel");
const PasswordRules = require("../models/PasswordRulesModel");
const Permissions = require("../models/PermissionsModel");
const RolePermissions = require("../models/RolePermissionsModel");
const UserManagementRoles = require("../models/RolesModel");
const UserManagementUserGroups = require("../models/UserGroupsModel");
const UserManagementUsers = require("../models/UsersModel");
const UserTypes = require("../models/UserTypesModel");
const ModulesModel = require("../models/ModulesModel");
const OnlinePayments = require("../models/OnlinePaymentsModel");
const Organization = require("../models/OrganizationsModel");
const PaymentGateWay = require("../models/PaymentGatewayModel");
const SubscriptionModules = require("../models/SubscriptionModulesModel");
const SubscriptionPayments = require("../models/SubscriptionPaymentsModel");
const SubscriptionPlans = require("../models/SubscriptionPlansModel");
const SubscriptionRenewals = require("../models/SubscriptionRenewalsModel");
const Subscriptions = require("../models/SubscriptionsModel");
const Tenants = require("../models/TenantsModel");
const BranchesModel = require("../models/BranchesModel");
const User = require("../models/UserModel");
const UserRole = require("../models/UserRoleModel");
const CompanyProfileModel = require("../models/CompanyProfileModel");
const Countries = require("../models/OrganizationsModel").associations.country.target;
const Employee = require("../models/UsersModel").associations.employee.target;

const seedDatabase = async (syncOption = { alter: true }) => {
  try {
    // Sync database
    await sequelize.sync(syncOption);
    console.log(`Database synced with ${JSON.stringify(syncOption)}`);

    //-----------------------------------------------------User Management Seeds------------------------------------------------------------

     // Seed CountryList
    const countryList = [
      ["AF", "Afghanistan", "أفغانستان", "Afghan", "أفغانستاني"],
      ["AL", "Albania", "ألبانيا", "Albanian", "ألباني"],
      ["AX", "Aland Islands", "جزر آلاند", "Aland Islander", "آلاندي"],
      ["DZ", "Algeria", "الجزائر", "Algerian", "جزائري"],
      [
        "AS",
        "American Samoa",
        "ساموا-الأمريكي",
        "American Samoan",
        "أمريكي سامواني",
      ],
      ["AD", "Andorra", "أندورا", "Andorran", "أندوري"],
      ["AO", "Angola", "أنغولا", "Angolan", "أنقولي"],
      ["AI", "Anguilla", "أنغويلا", "Anguillan", "أنغويلي"],
      ["AQ", "Antarctica", "أنتاركتيكا", "Antarctican", "أنتاركتيكي"],
      ["AG", "Antigua and Barbuda", "أنتيغوا وبربودا", "Antiguan", "بربودي"],
      ["AR", "Argentina", "الأرجنتين", "Argentinian", "أرجنتيني"],
      ["AM", "Armenia", "أرمينيا", "Armenian", "أرميني"],
      ["AW", "Aruba", "أروبه", "Aruban", "أوروبهيني"],
      ["AU", "Australia", "أستراليا", "Australian", "أسترالي"],
      ["AT", "Austria", "النمسا", "Austrian", "نمساوي"],
      ["AZ", "Azerbaijan", "أذربيجان", "Azerbaijani", "أذربيجاني"],
      ["BS", "Bahamas", "الباهاماس", "Bahamian", "باهاميسي"],
      ["BH", "Bahrain", "البحرين", "Bahraini", "بحريني"],
      ["BD", "Bangladesh", "بنغلاديش", "Bangladeshi", "بنغلاديشي"],
      ["BB", "Barbados", "بربادوس", "Barbadian", "بربادوسي"],
      ["BY", "Belarus", "روسيا البيضاء", "Belarusian", "روسي"],
      ["BE", "Belgium", "بلجيكا", "Belgian", "بلجيكي"],
      ["BZ", "Belize", "بيليز", "Belizean", "بيليزي"],
      ["BJ", "Benin", "بنين", "Beninese", "بنيني"],
      [
        "BL",
        "Saint Barthelemy",
        "سان بارتيلمي",
        "Saint Barthelmian",
        "سان بارتيلمي",
      ],
      ["BM", "Bermuda", "جزر برمودا", "Bermudan", "برمودي"],
      ["BT", "Bhutan", "بوتان", "Bhutanese", "بوتاني"],
      ["BO", "Bolivia", "بوليفيا", "Bolivian", "بوليفي"],
      [
        "BA",
        "Bosnia and Herzegovina",
        "البوسنة و الهرسك",
        "Bosnian / Herzegovinian",
        "بوسني/هرسكي",
      ],
      ["BW", "Botswana", "بوتسوانا", "Botswanan", "بوتسواني"],
      ["BV", "Bouvet Island", "جزيرة بوفيه", "Bouvetian", "بوفيهي"],
      ["BR", "Brazil", "البرازيل", "Brazilian", "برازيلي"],
      [
        "IO",
        "British Indian Ocean Territory",
        "إقليم المحيط الهندي البريطاني",
        "British Indian Ocean Territory",
        "إقليم المحيط الهندي البريطاني",
      ],
      ["BN", "Brunei Darussalam", "بروني", "Bruneian", "بروني"],
      ["BG", "Bulgaria", "بلغاريا", "Bulgarian", "بلغاري"],
      ["BF", "Burkina Faso", "بوركينا فاسو", "Burkinabe", "بوركيني"],
      ["BI", "Burundi", "بوروندي", "Burundian", "بورونيدي"],
      ["KH", "Cambodia", "كمبوديا", "Cambodian", "كمبودي"],
      ["CM", "Cameroon", "كاميرون", "Cameroonian", "كاميروني"],
      ["CA", "Canada", "كندا", "Canadian", "كندي"],
      ["CV", "Cape Verde", "الرأس الأخضر", "Cape Verdean", "الرأس الأخضر"],
      ["KY", "Cayman Islands", "جزر كايمان", "Caymanian", "كايماني"],
      [
        "CF",
        "Central African Republic",
        "جمهورية أفريقيا الوسطى",
        "Central African",
        "أفريقي",
      ],
      ["TD", "Chad", "تشاد", "Chadian", "تشادي"],
      ["CL", "Chile", "شيلي", "Chilean", "شيلي"],
      ["CN", "China", "الصين", "Chinese", "صيني"],
      [
        "CX",
        "Christmas Island",
        "جزيرة عيد الميلاد",
        "Christmas Islander",
        "جزيرة عيد الميلاد",
      ],
      [
        "CC",
        "Cocos [Keeling] Islands",
        "جزر كوكوس",
        "Cocos Islander",
        "جزر كوكوس",
      ],
      ["CO", "Colombia", "كولومبيا", "Colombian", "كولومبي"],
      ["KM", "Comoros", "جزر القمر", "Comorian", "جزر القمر"],
      ["CG", "Congo", "الكونغو", "Congolese", "كونغي"],
      ["CK", "Cook Islands", "جزر كوك", "Cook Islander", "جزر كوك"],
      ["CR", "Costa Rica", "كوستاريكا", "Costa Rican", "كوستاريكي"],
      ["HR", "Croatia", "كرواتيا", "Croatian", "كوراتي"],
      ["CU", "Cuba", "كوبا", "Cuban", "كوبي"],
      ["CY", "Cyprus", "قبرص", "Cypriot", "قبرصي"],
      ["CW", "Curaçao", "كوراساو", "Curacian", "كوراساوي"],
      ["CZ", "Czech Republic", "الجمهورية التشيكية", "Czech", "تشيكي"],
      ["DK", "Denmark", "الدانمارك", "Danish", "دنماركي"],
      ["DJ", "Djibouti", "جيبوتي", "Djiboutian", "جيبوتي"],
      ["DM", "Dominica", "دومينيكا", "Dominica", "دومينيكي"],
      [
        "DO",
        "Dominican Republic",
        "الجمهورية الدومينيكية",
        "Dominican",
        "دومينيكي",
      ],
      ["EC", "Ecuador", "إكوادور", "Ecuadorian", "إكوادوري"],
      ["EG", "Egypt", "مصر", "Egyptian", "مصري"],
      ["SV", "El Salvador", "إلسلفادور", "Salvadoran", "سلفادوري"],
      [
        "GQ",
        "Equatorial Guinea",
        "غينيا الاستوائي",
        "Equatorial Guinean",
        "غيني",
      ],
      ["ER", "Eritrea", "إريتريا", "Eritrean", "إريتيري"],
      ["EE", "Estonia", "استونيا", "Estonian", "استوني"],
      ["ET", "Ethiopia", "أثيوبيا", "Ethiopian", "أثيوبي"],
      [
        "FK",
        "Falkland Islands [Malvinas]",
        "جزر فوكلاند",
        "Falkland Islander",
        "فوكلاندي",
      ],
      ["FO", "Faroe Islands", "جزر فارو", "Faroese", "جزر فارو"],
      ["FJ", "Fiji", "فيجي", "Fijian", "فيجي"],
      ["FI", "Finland", "فنلندا", "Finnish", "فنلندي"],
      ["FR", "France", "فرنسا", "French", "فرنسي"],
      [
        "GF",
        "French Guiana",
        "غويانا الفرنسية",
        "French Guianese",
        "غويانا الفرنسية",
      ],
      [
        "PF",
        "French Polynesia",
        "بولينيزيا الفرنسية",
        "French Polynesian",
        "بولينيزيي",
      ],
      [
        "TF",
        "French Southern and Antarctic Lands",
        "أراض فرنسية جنوبية وأنتارتيكية",
        "French Southern and Antarctic Lands",
        "أراض فرنسية جنوبية وأنتارتيكية",
      ],
      ["GA", "Gabon", "الغابون", "Gabonese", "غابوني"],
      ["GM", "Gambia", "غامبيا", "Gambian", "غامبي"],
      ["GE", "Georgia", "جيورجيا", "Georgian", "جيورجي"],
      ["DE", "Germany", "ألمانيا", "German", "ألماني"],
      ["GH", "Ghana", "غانا", "Ghanaian", "غاني"],
      ["GI", "Gibraltar", "جبل طارق", "Gibraltar", "جبل طارق"],
      ["GG", "Guernsey", "غيرنزي", "Guernsian", "غيرنزي"],
      ["GR", "Greece", "اليونان", "Greek", "يوناني"],
      ["GL", "Greenland", "جرينلاند", "Greenlandic", "جرينلاندي"],
      ["GD", "Grenada", "غرينادا", "Grenadian", "غرينادي"],
      ["GP", "Guadeloupe", "جزر جوادلوب", "Guadeloupe", "جزر جوادلوب"],
      ["GU", "Guam", "جوام", "Guamanian", "جوامي"],
      ["GT", "Guatemala", "غواتيمال", "Guatemalan", "غواتيمالي"],
      ["GN", "Guinea", "غينيا", "Guinean", "غيني"],
      ["GW", "Guinea-Bissau", "غينيا-بيساو", "Guinea-Bissauan", "غيني"],
      ["GY", "Guyana", "غيانا", "Guyanese", "غياني"],
      ["HT", "Haiti", "هايتي", "Haitian", "هايتي"],
      [
        "HM",
        "Heard and Mc Donald Islands",
        "جزيرة هيرد وجزر ماكدونالد",
        "Heard and Mc Donald Islanders",
        "جزيرة هيرد وجزر ماكدونالد",
      ],
      ["HN", "Honduras", "هندوراس", "Honduran", "هندوراسي"],
      ["HK", "Hong Kong", "هونغ كونغ", "Hongkongese", "هونغ كونغي"],
      ["HU", "Hungary", "المجر", "Hungarian", "مجري"],
      ["IS", "Iceland", "آيسلندا", "Icelandic", "آيسلندي"],
      ["IN", "India", "الهند", "Indian", "هندي"],
      ["IM", "Isle of Man", "جزيرة مان", "Manx", "ماني"],
      ["ID", "Indonesia", "أندونيسيا", "Indonesian", "أندونيسيي"],
      ["IR", "Iran", "إيران", "Iranian", "إيراني"],
      ["IQ", "Iraq", "العراق", "Iraqi", "عراقي"],
      ["IE", "Ireland", "إيرلندا", "Irish", "إيرلندي"],
      ["IL", "Israel", "إسرائيل", "Israeli", "إسرائيلي"],
      ["IT", "Italy", "إيطاليا", "Italian", "إيطالي"],
      ["CI", "Ivory Coast", "ساحل العاج", "Ivory Coastian", "ساحل العاج"],
      ["JE", "Jersey", "جيرزي", "Jersian", "جيرزي"],
      ["JM", "Jamaica", "جمايكا", "Jamaican", "جمايكي"],
      ["JP", "Japan", "اليابان", "Japanese", "ياباني"],
      ["JO", "Jordan", "الاردن", "Jordanian", "أردني"],
      ["KZ", "Kazakhstan", "كازاخستان", "Kazakh", "كازاخستاني"],
      ["KE", "Kenya", "كينيا", "Kenyan", "كيني"],
      ["KI", "Kiribati", "كيريباتي", "I-Kiribati", "كيريباتي"],
      ["KP", "Korea[North Korea]", "كوريا الشمالية", "North Korean", "كوري"],
      ["KR", "Korea[South Korea]", "كوريا الجنوبية", "South Korean", "كوري"],
      ["XK", "Kosovo", "كوسوفو", "Kosovar", "كوسيفي"],
      ["KW", "Kuwait", "الكويت", "Kuwaiti", "كويتي"],
      ["KG", "Kyrgyzstan", "قيرغيزستان", "Kyrgyzstani", "قيرغيزستاني"],
      ["LA", "Lao PDR", "لاوس", "Laotian", "لاوسي"],
      ["LV", "Latvia", "لاتفيا", "Latvian", "لاتيفي"],
      ["LB", "Lebanon", "لبنان", "Lebanese", "لبناني"],
      ["LS", "Lesotho", "ليسوتو", "Basotho", "ليوسيتي"],
      ["LR", "Liberia", "ليبيريا", "Liberian", "ليبيري"],
      ["LY", "Libya", "ليبيا", "Libyan", "ليبي"],
      ["LI", "Liechtenstein", "ليختنشتين", "Liechtenstein", "ليختنشتيني"],
      ["LT", "Lithuania", "لتوانيا", "Lithuanian", "لتوانيي"],
      ["LU", "Luxembourg", "لوكسمبورغ", "Luxembourger", "لوكسمبورغي"],
      ["LK", "Sri Lanka", "سريلانكا", "Sri Lankan", "سريلانكي"],
      ["MO", "Macau", "ماكاو", "Macanese", "ماكاوي"],
      ["MK", "Macedonia", "مقدونيا", "Macedonian", "مقدوني"],
      ["MG", "Madagascar", "مدغشقر", "Malagasy", "مدغشقري"],
      ["MW", "Malawi", "مالاوي", "Malawian", "مالاوي"],
      ["MY", "Malaysia", "ماليزيا", "Malaysian", "ماليزي"],
      ["MV", "Maldives", "المالديف", "Maldivian", "مالديفي"],
      ["ML", "Mali", "مالي", "Malian", "مالي"],
      ["MT", "Malta", "مالطا", "Maltese", "مالطي"],
      ["MH", "Marshall Islands", "جزر مارشال", "Marshallese", "مارشالي"],
      ["MQ", "Martinique", "مارتينيك", "Martiniquais", "مارتينيكي"],
      ["MR", "Mauritania", "موريتانيا", "Mauritanian", "موريتانيي"],
      ["MU", "Mauritius", "موريشيوس", "Mauritian", "موريشيوسي"],
      ["YT", "Mayotte", "مايوت", "Mahoran", "مايوتي"],
      ["MX", "Mexico", "المكسيك", "Mexican", "مكسيكي"],
      ["FM", "Micronesia", "مايكرونيزيا", "Micronesian", "مايكرونيزيي"],
      ["MD", "Moldova", "مولدافيا", "Moldovan", "مولديفي"],
      ["MC", "Monaco", "موناكو", "Monacan", "مونيكي"],
      ["MN", "Mongolia", "منغوليا", "Mongolian", "منغولي"],
      ["ME", "Montenegro", "الجبل الأسود", "Montenegrin", "الجبل الأسود"],
      ["MS", "Montserrat", "مونتسيرات", "Montserratian", "مونتسيراتي"],
      ["MA", "Morocco", "المغرب", "Moroccan", "مغربي"],
      ["MZ", "Mozambique", "موزمبيق", "Mozambican", "موزمبيقي"],
      ["MM", "Myanmar", "ميانمار", "Myanmarian", "ميانماري"],
      ["NA", "Namibia", "ناميبيا", "Namibian", "ناميبي"],
      ["NR", "Nauru", "نورو", "Nauruan", "نوري"],
      ["NP", "Nepal", "نيبال", "Nepalese", "نيبالي"],
      ["NL", "Netherlands", "هولندا", "Dutch", "هولندي"],
      [
        "AN",
        "Netherlands Antilles",
        "جزر الأنتيل الهولندي",
        "Dutch Antilier",
        "هولندي",
      ],
      [
        "NC",
        "New Caledonia",
        "كاليدونيا الجديدة",
        "New Caledonian",
        "كاليدوني",
      ],
      ["NZ", "New Zealand", "نيوزيلندا", "New Zealander", "نيوزيلندي"],
      ["NI", "Nicaragua", "نيكاراجوا", "Nicaraguan", "نيكاراجوي"],
      ["NE", "Niger", "النيجر", "Nigerien", "نيجيري"],
      ["NG", "Nigeria", "نيجيريا", "Nigerian", "نيجيري"],
      ["NU", "Niue", "ني", "Niuean", "ني"],
      [
        "NF",
        "Norfolk Island",
        "جزيرة نورفولك",
        "Norfolk Islander",
        "نورفوليكي",
      ],
      [
        "MP",
        "Northern Mariana Islands",
        "جزر ماريانا الشمالية",
        "Northern Marianan",
        "ماريني",
      ],
      ["NO", "Norway", "النرويج", "Norwegian", "نرويجي"],
      ["OM", "Oman", "سلطنة عمان", "Omani", "عماني"],
      ["PK", "Pakistan", "باكستان", "Pakistani", "باكستاني"],
      ["PW", "Palau", "بالاو", "Palauan", "بالاوي"],
      ["PS", "Palestine", "فلسطين", "Palestinian", "فلسطيني"],
      ["PA", "Panama", "بنما", "Panamanian", "بنمي"],
      [
        "PG",
        "Papua New Guinea",
        "بابوا غينيا الجديدة",
        "Papua New Guinean",
        "بابوي",
      ],
      ["PY", "Paraguay", "باراغواي", "Paraguayan", "بارغاوي"],
      ["PE", "Peru", "بيرو", "Peruvian", "بيري"],
      ["PH", "Philippines", "الفليبين", "Filipino", "فلبيني"],
      ["PN", "Pitcairn", "بيتكيرن", "Pitcairn Islander", "بيتكيرني"],
      ["PL", "Poland", "بولندا", "Polish", "بولندي"],
      ["PT", "Portugal", "البرتغال", "Portuguese", "برتغالي"],
      ["PR", "Puerto Rico", "بورتو ريكو", "Puerto Rican", "بورتي"],
      ["QA", "Qatar", "قطر", "Qatari", "قطري"],
      ["RE", "Reunion Island", "ريونيون", "Reunionese", "ريونيوني"],
      ["RO", "Romania", "رومانيا", "Romanian", "روماني"],
      ["RU", "Russian", "روسيا", "Russian", "روسي"],
      ["RW", "Rwanda", "رواندا", "Rwandan", "رواندا"],
      [
        "KN",
        "Saint Kitts and Nevis",
        "سانت كيتس ونيفس,",
        "Kittitian/Nevisian",
        "سانت كيتس ونيفس",
      ],
      [
        "MF",
        "Saint Martin [French part]",
        "ساينت مارتن فرنسي",
        "St. Martian[French]",
        "ساينت مارتني فرنسي",
      ],
      [
        "SX",
        "Sint Maarten [Dutch part]",
        "ساينت مارتن هولندي",
        "St. Martian[Dutch]",
        "ساينت مارتني هولندي",
      ],
      [
        "LC",
        "Saint Pierre and Miquelon",
        "سان بيير وميكلون",
        "St. Pierre and Miquelon",
        "سان بيير وميكلوني",
      ],
      [
        "VC",
        "Saint Vincent and the Grenadines",
        "سانت فنسنت وجزر غرينادين",
        "Saint Vincent and the Grenadines",
        "سانت فنسنت وجزر غرينادين",
      ],
      ["WS", "Samoa", "ساموا", "Samoan", "ساموي"],
      ["SM", "San Marino", "سان مارينو", "Sammarinese", "ماريني"],
      [
        "ST",
        "Sao Tome and Principe",
        "ساو تومي وبرينسيبي",
        "Sao Tomean",
        "ساو تومي وبرينسيبي",
      ],
      [
        "SA",
        "Saudi Arabia",
        "المملكة العربية السعودية",
        "Saudi Arabian",
        "سعودي",
      ],
      ["SN", "Senegal", "السنغال", "Senegalese", "سنغالي"],
      ["RS", "Serbia", "صربيا", "Serbian", "صربي"],
      ["SC", "Seychelles", "سيشيل", "Seychellois", "سيشيلي"],
      ["SL", "Sierra Leone", "سيراليون", "Sierra Leonean", "سيراليوني"],
      ["SG", "Singapore", "سنغافورة", "Singaporean", "سنغافوري"],
      ["SK", "Slovakia", "سلوفاكيا", "Slovak", "سولفاكي"],
      ["SI", "Slovenia", "سلوفينيا", "Slovenian", "سولفيني"],
      ["SB", "Solomon Islands", "جزر سليمان", "Solomon Island", "جزر سليمان"],
      ["SO", "Somalia", "الصومال", "Somali", "صومالي"],
      ["ZA", "South Africa", "جنوب أفريقيا", "South African", "أفريقي"],
      [
        "GS",
        "South Georgia and the South Sandwich",
        "المنطقة القطبية الجنوبية",
        "South Georgia and the South Sandwich",
        "لمنطقة القطبية الجنوبية",
      ],
      [
        "SS",
        "South Sudan",
        "السودان الجنوبي",
        "South Sudanese",
        "سوادني جنوبي",
      ],
      ["ES", "Spain", "إسبانيا", "Spanish", "إسباني"],
      ["SH", "Saint Helena", "سانت هيلانة", "St. Helenian", "هيلاني"],
      ["SD", "Sudan", "السودان", "Sudanese", "سوداني"],
      ["SR", "Suriname", "سورينام", "Surinamese", "سورينامي"],
      [
        "SJ",
        "Svalbard and Jan Mayen",
        "سفالبارد ويان ماين",
        "Svalbardian/Jan Mayenian",
        "سفالبارد ويان ماين",
      ],
      ["SZ", "Swaziland", "سوازيلند", "Swazi", "سوازيلندي"],
      ["SE", "Sweden", "السويد", "Swedish", "سويدي"],
      ["CH", "Switzerland", "سويسرا", "Swiss", "سويسري"],
      ["SY", "Syria", "الجمهورية العربية السورية", "Syrian", "سوري"],
      ["TW", "Taiwan", "تايوان", "Taiwanese", "تايواني"],
      ["TJ", "Tajikistan", "طاجيكستان", "Tajikistani", "طاجيكستاني"],
      ["TZ", "Tanzania", "تنزانيا", "Tanzanian", "تنزانيي"],
      ["TH", "Thailand", "تايلندا", "Thai", "تايلندي"],
      ["TL", "Timor-Leste", "تيمور الشرقية", "Timor-Lestian", "تيموري"],
      ["TG", "Togo", "توغو", "Togolese", "توغي"],
      ["TK", "Tokelau", "توكيلاو", "Tokelaian", "توكيلاوي"],
      ["TO", "Tonga", "تونغا", "Tongan", "تونغي"],
      [
        "TT",
        "Trinidad and Tobago",
        "ترينيداد وتوباغو",
        "Trinidadian/Tobagonian",
        "ترينيداد وتوباغو",
      ],
      ["TN", "Tunisia", "تونس", "Tunisian", "تونسي"],
      ["TR", "Turkey", "تركيا", "Turkish", "تركي"],
      ["TM", "Turkmenistan", "تركمانستان", "Turkmen", "تركمانستاني"],
      [
        "TC",
        "Turks and Caicos Islands",
        "جزر توركس وكايكوس",
        "Turks and Caicos Islands",
        "جزر توركس وكايكوس",
      ],
      ["TV", "Tuvalu", "توفالو", "Tuvaluan", "توفالي"],
      ["UG", "Uganda", "أوغندا", "Ugandan", "أوغندي"],
      ["UA", "Ukraine", "أوكرانيا", "Ukrainian", "أوكراني"],
      [
        "AE",
        "United Arab Emirates",
        "الإمارات العربية المتحدة",
        "Emirati",
        "إماراتي",
      ],
      ["GB", "United Kingdom", "المملكة المتحدة", "British", "بريطاني"],
      ["US", "United States", "الولايات المتحدة", "American", "أمريكي"],
      [
        "UM",
        "US Minor Outlying Islands",
        "قائمة الولايات والمناطق الأمريكية",
        "US Minor Outlying Islander",
        "أمريكي",
      ],
      ["UY", "Uruguay", "أورغواي", "Uruguayan", "أورغواي"],
      ["UZ", "Uzbekistan", "أوزباكستان", "Uzbek", "أوزباكستاني"],
      ["VU", "Vanuatu", "فانواتو", "Vanuatuan", "فانواتي"],
      ["VE", "Venezuela", "فنزويلا", "Venezuelan", "فنزويلي"],
      ["VN", "Vietnam", "فيتنام", "Vietnamese", "فيتنامي"],
      [
        "VI",
        "Virgin Islands [U.S.]",
        "الجزر العذراء الأمريكي",
        "American Virgin Islander",
        "أمريكي",
      ],
      ["VA", "Vatican City", "فنزويلا", "Vatican", "فاتيكاني"],
      [
        "WF",
        "Wallis and Futuna Islands",
        "والس وفوتونا",
        "Wallisian/Futunan",
        "فوتوني",
      ],
      ["EH", "Western Sahara", "الصحراء الغربية", "Sahrawian", "صحراوي"],
      ["YE", "Yemen", "اليمن", "Yemeni", "يمني"],
      ["ZM", "Zambia", "زامبيا", "Zambian", "زامبياني"],
      ["ZW", "Zimbabwe", "زمبابوي", "Zimbabwean", "زمبابوي"],
    ];

    const countriesData = countryList.map(
      ([
        country_code,
        country_enName,
        country_arName,
        country_enNationality,
        country_arNationality,
      ]) => ({
        country_code,
        country_enName,
        country_arName,
        country_enNationality,
        country_arNationality,
      }),
    );

    await Countries.bulkCreate(countriesData, { ignoreDuplicates: true });
    console.log("Countries successfully seeded!");

    // Seed data for 1st employee
    const sampleEmployees = [
      {
        personalDetails: {
          profileImage: "https://example.com/profile1.jpg",
          employeeNo: "AX-0001",
          fullNameEnglish: "John Doe",
          fullNameArabic: "جون دو",
          qidNumber: 123456,
          passportNumber: "P1234567",
          qidExpireDate: "2026-12-31",
          passportExpireDate: "2026-12-31",
          recruitementType: "Local",
          visaNumber: "V1234567",
          nationality: "American",
          mobileNumber: "+97467895432",
          email: "john.doe@example.com",
          gender: "Male",
          dateOfBirth: "1990-01-01",
          currentAddress: "123 Main St, City, Country",
          permanentAddress: "456 Permanent Rd, City, Country",
          maritalStatus: "Single",
        },
        drivingLicenseDetails: {
          isAvailableLicense: true,
          drivingLicenseCopy: null,
          licenseNumber: "DL12345",
          firstIssueDate: "2022-01-01",
          licenseExpireDate: "2023-01-01",
          licenseCategory: ["Excavator", "Crane"],
          licenseNotes: ["Glasses", "Automatic"],
        },
        bankDetails: {
          bankName: "ABC Bank",
          accountHolderName: "John Doe",
          accountNumber: 1234567890123456,
          branchName: "Main Branch",
          IBAN: "QA1234567890123456789",
          swiftCode: 23121,
          shortCode: 12345,
        },
        sponserDetails: {
          sponserName: "Sponsored by Outside",
          employeeContractCopy: null,
          contractExpireDate: "2025-12-31",
          companyCRCopyExpireDate: "2025-12-31",
          computerCardCopy: null,
          computerCardExpireDate: "2025-12-31",
          NOC: null,
          companyCRCopy: null,
        },
        documentDetails: {
          image: null,
          copyOfQID: null,
          copyOfPassport: null,
          resume: null,
          qualificationCertificate: null,
          otherDocuments: null,
        },
        insuranceDetails: {
          healthCardNumber: "HC123456789",
          issuingAuthority: "Qatar Health Ministry",
          expireDate: "2025-12-31",
          knownMedicalConditions: "None",
          allergies: "Peanuts",
          notesOrRemarks: "Requires annual check-up",
          policyNumber: "POL123456",
          coverageDetails: "Comprehensive medical and dental coverage",
          compensationExpireDate: "2026-12-31",
          insuranceProvider: "Doha Insurance",
          additionalPolicyDetails: "Includes emergency evacuation",
          attachments: null,
        },
        fleetDetails: {
          operatorType: "Forklift Operator",
          equipmentDetails: "LAP-121121221 - Heavy Type",
          month: "2025-06",
          gatePassNumber: "GP789045",
          gatePassLocation: "Doha",
          gateAccessNo: "1, 12",
          appHashNumber: "App808706",
          gatePassIssueDate: "2023-01-01",
          gatePassExpireDate: "2025-12-31",
          gatePassAttachment: null,
          gatePassExpireStatus: "Valid",
          fleetStatus: "Active",
        },
        trainingCertificationsDetails: {
          trainingTitle: "Certified Trainer",
          issueDate: "2023-01-01",
          expiryDate: "2023-01-06",
          idIqamaNo: "IQ799979",
          companyName: "Auto-Expert",
          description: "Training Certification",
          certifiedAs: "James Dafoe",
          trainingCertificate: null,
        },
        otherDetails: {
          dateOfJoin: "2023-01-01",
          designation: "Software Engineer",
          employeeType: "Office",
          status: "Active",
          workPlace: "Qatar",
          departmentName: "IT",
          annualLeaveCount: 6,
          destinationCountry: "Qatar",
        },
        completionStatuses: {
          bank: "Not Available Now",
          other: "Not Available Now",
          career: "Yes",
          family: "Yes",
          license: "No",
          payroll: "No",
          sponsor: "Not Available Now",
          personal: "Yes",
          documents: "No",
          insurance: "Yes",
          fleet: "Yes",
          training: "Yes",
          contract: "Yes",
        },
      },
    ];

    await Employee.bulkCreate(sampleEmployees, { ignoreDuplicates: true });
    console.log("Employees 1 successfully seeded!");

    // Seed data for 2nd employee
    const sampleEmployees2 = [
      {
        personalDetails: {
          profileImage: "https://example.com/profile1.jpg",
          employeeNo: "AX-0002",
          fullNameEnglish: "Alan Taylor",
          fullNameArabic: "جون دو",
          qidNumber: 232532,
          passportNumber: "P1234567",
          qidExpireDate: "2026-12-31",
          passportExpireDate: "2026-12-31",
          recruitementType: "Local",
          visaNumber: "V1234567",
          nationality: "American",
          mobileNumber: "+97467895432",
          email: "alan.taylor@example.com",
          gender: "Male",
          dateOfBirth: "1990-01-01",
          currentAddress: "123 Main St, City, Country",
          permanentAddress: "456 Permanent Rd, City, Country",
          maritalStatus: "Single",
        },
        drivingLicenseDetails: {
          isAvailableLicense: true,
          drivingLicenseCopy: null,
          licenseNumber: "DL12345",
          firstIssueDate: "2022-01-01",
          licenseExpireDate: "2023-01-01",
          licenseCategory: ["Excavator", "Crane"],
          licenseNotes: ["Glasses", "Automatic"],
        },
        bankDetails: {
          bankName: "ABC Bank",
          accountHolderName: "John Doe",
          accountNumber: 1234567890123456,
          branchName: "Main Branch",
          IBAN: "QA1234567890123456789",
          swiftCode: 1232333,
          shortCode: 12345,
        },
        sponserDetails: {
          sponserName: "Sponsored by Outside",
          employeeContractCopy: null,
          contractExpireDate: "2025-12-31",
          companyCRCopyExpireDate: "2025-12-31",
          computerCardCopy: null,
          computerCardExpireDate: "2025-12-31",
          NOC: null,
          companyCRCopy: null,
        },
        documentDetails: {
          image: null,
          copyOfQID: null,
          copyOfPassport: null,
          resume: null,
          qualificationCertificate: null,
          otherDocuments: null,
        },
        insuranceDetails: {
          healthCardNumber: "HC987654321",
          issuingAuthority: "Hamad Medical Corporation",
          expireDate: "2025-12-31",
          knownMedicalConditions: "Hypertension",
          allergies: "None",
          notesOrRemarks: "Requires monthly monitoring",
          policyNumber: "POL789123",
          coverageDetails: "Basic medical coverage, excludes dental",
          compensationExpireDate: "2026-12-31",
          insuranceProvider: "Al Koot Insurance",
          additionalPolicyDetails: "Excludes pre-existing conditions",
          attachments: null,
        },
        fleetDetails: {
          operatorType: "Manlift Operator",
          equipmentDetails: "LAP-121121221 - Heavy Type",
          month: "2025-07",
          gatePassNumber: "GP123456",
          gatePassLocation: "RL",
          gateAccessNo: "1, 14",
          appHashNumber: "App543555",
          gatePassIssueDate: "2023-01-01",
          gatePassExpireDate: "2025-12-31",
          gatePassAttachment: null,
          gatePassExpireStatus: "Valid",
          fleetStatus: "Active",
        },
        trainingCertificationsDetails: {
          trainingTitle: "Certified Trainer",
          issueDate: "2023-01-01",
          expiryDate: "2023-01-06",
          idIqamaNo: "IQ335655",
          companyName: "Auto-Expert",
          description: "Training Certification",
          certifiedAs: "James Dafoe",
          trainingCertificate: null,
        },
        otherDetails: {
          dateOfJoin: "2023-01-01",
          designation: "Software Engineer",
          employeeType: "Operation",
          status: "Active",
          workPlace: "Qatar",
          departmentName: "IT",
          annualLeaveCount: 10,
          destinationCountry: "Qatar",
        },
        completionStatuses: {
          bank: "Not Available Now",
          other: "Not Available Now",
          career: "Yes",
          family: "Yes",
          license: "No",
          payroll: "No",
          sponsor: "Not Available Now",
          personal: "Yes",
          documents: "No",
          insurance: "Yes",
          fleet: "Yes",
          training: "Yes",
          contract: "Yes",
        },
      },
    ];

    await Employee.bulkCreate(sampleEmployees2, { ignoreDuplicates: true });
    console.log("Employees 2 successfully seeded!");

    // Seed data for 3rd employee
    const sampleEmployees3 = [
      {
        personalDetails: {
          profileImage: "https://example.com/profile1.jpg",
          employeeNo: "AX-0003",
          fullNameEnglish: "Mathew Jackson",
          fullNameArabic: "جون دو",
          qidNumber: 785432,
          passportNumber: "P1234567",
          qidExpireDate: "2026-12-31",
          passportExpireDate: "2026-12-31",
          recruitementType: "Local",
          visaNumber: "V1234567",
          nationality: "American",
          mobileNumber: "+97467895432",
          email: "mathew.jackson@example.com",
          gender: "Male",
          dateOfBirth: "1990-01-01",
          currentAddress: "123 Main St, City, Country",
          permanentAddress: "456 Permanent Rd, City, Country",
          maritalStatus: "Single",
        },
        drivingLicenseDetails: {
          isAvailableLicense: true,
          drivingLicenseCopy: null,
          licenseNumber: "DL12345",
          firstIssueDate: "2022-01-01",
          licenseExpireDate: "2023-01-01",
          licenseCategory: ["Excavator", "Crane"],
          licenseNotes: ["Glasses", "Automatic"],
        },
        bankDetails: {
          bankName: "ABC Bank",
          accountHolderName: "Mathew Jackson",
          accountNumber: 1234567890123456,
          branchName: "Main Branch",
          IBAN: "QA1234567890123456789",
          swiftCode: 1232333,
          shortCode: 12345,
        },
        sponserDetails: {
          sponserName: "Sponsored by Outside",
          employeeContractCopy: null,
          contractExpireDate: "2025-12-31",
          companyCRCopyExpireDate: "2025-12-31",
          computerCardCopy: null,
          computerCardExpireDate: "2025-12-31",
          NOC: null,
          companyCRCopy: null,
        },
        documentDetails: {
          image: null,
          copyOfQID: null,
          copyOfPassport: null,
          resume: null,
          qualificationCertificate: null,
          otherDocuments: null,
        },
        insuranceDetails: {
          healthCardNumber: "HC987654321",
          issuingAuthority: "Hamad Medical Corporation",
          expireDate: "2025-12-31",
          knownMedicalConditions: "Hypertension",
          allergies: "None",
          notesOrRemarks: "Requires monthly monitoring",
          policyNumber: "POL789123",
          coverageDetails: "Basic medical coverage, excludes dental",
          compensationExpireDate: "2026-12-31",
          insuranceProvider: "Al Koot Insurance",
          additionalPolicyDetails: "Excludes pre-existing conditions",
          attachments: null,
        },
        fleetDetails: {
          operatorType: "Manlift Operator",
          equipmentDetails: "LAP-121121221 - Heavy Type",
          month: "2025-07",
          gatePassNumber: "GP123456",
          gatePassLocation: "RL",
          gateAccessNo: "1, 14",
          appHashNumber: "App543555",
          gatePassIssueDate: "2023-01-01",
          gatePassExpireDate: "2025-12-31",
          gatePassAttachment: null,
          gatePassExpireStatus: "Valid",
          fleetStatus: "Active",
        },
        trainingCertificationsDetails: {
          trainingTitle: "Certified Trainer",
          issueDate: "2023-01-01",
          expiryDate: "2023-01-06",
          idIqamaNo: "IQ335655",
          companyName: "Auto-Expert",
          description: "Training Certification",
          certifiedAs: "James Dafoe",
          trainingCertificate: null,
        },
        otherDetails: {
          dateOfJoin: "2023-01-01",
          designation: "Software Engineer",
          employeeType: "Operation",
          status: "Active",
          workPlace: "Qatar",
          departmentName: "IT",
          annualLeaveCount: 10,
          destinationCountry: "Qatar",
        },
        completionStatuses: {
          bank: "Not Available Now",
          other: "Not Available Now",
          career: "Yes",
          family: "Yes",
          license: "No",
          payroll: "No",
          sponsor: "Not Available Now",
          personal: "Yes",
          documents: "No",
          insurance: "Yes",
          fleet: "Yes",
          training: "Yes",
          contract: "Yes",
        },
      },
    ];

    await Employee.bulkCreate(sampleEmployees3, { ignoreDuplicates: true });
    console.log("Employees 3 successfully seeded!");

    // Seed data for 4th employee
    const sampleEmployees4 = [
      {
        personalDetails: {
          profileImage: "https://example.com/profile1.jpg",
          employeeNo: "AX-0004",
          fullNameEnglish: "William Smith",
          fullNameArabic: "جون دو",
          qidNumber: 678686,
          passportNumber: "P1234567",
          qidExpireDate: "2026-12-31",
          passportExpireDate: "2026-12-31",
          recruitementType: "Local",
          visaNumber: "V1234567",
          nationality: "American",
          mobileNumber: "+97467895432",
          email: "william.smith@example.com",
          gender: "Male",
          dateOfBirth: "1990-01-01",
          currentAddress: "123 Main St, City, Country",
          permanentAddress: "456 Permanent Rd, City, Country",
          maritalStatus: "Single",
        },
        drivingLicenseDetails: {
          isAvailableLicense: true,
          drivingLicenseCopy: null,
          licenseNumber: "DL12345",
          firstIssueDate: "2022-01-01",
          licenseExpireDate: "2023-01-01",
          licenseCategory: ["Excavator", "Crane"],
          licenseNotes: ["Glasses", "Automatic"],
        },
        bankDetails: {
          bankName: "ABC Bank",
          accountHolderName: "William Smith",
          accountNumber: 1234567890123456,
          branchName: "Main Branch",
          IBAN: "QA1234567890123456789",
          swiftCode: 1232333,
          shortCode: 12345,
        },
        sponserDetails: {
          sponserName: "Sponsored by Outside",
          employeeContractCopy: null,
          contractExpireDate: "2025-12-31",
          companyCRCopyExpireDate: "2025-12-31",
          computerCardCopy: null,
          computerCardExpireDate: "2025-12-31",
          NOC: null,
          companyCRCopy: null,
        },
        documentDetails: {
          image: null,
          copyOfQID: null,
          copyOfPassport: null,
          resume: null,
          qualificationCertificate: null,
          otherDocuments: null,
        },
        insuranceDetails: {
          healthCardNumber: "HC987654321",
          issuingAuthority: "Hamad Medical Corporation",
          expireDate: "2025-12-31",
          knownMedicalConditions: "Hypertension",
          allergies: "None",
          notesOrRemarks: "Requires monthly monitoring",
          policyNumber: "POL789123",
          coverageDetails: "Basic medical coverage, excludes dental",
          compensationExpireDate: "2026-12-31",
          insuranceProvider: "Al Koot Insurance",
          additionalPolicyDetails: "Excludes pre-existing conditions",
          attachments: null,
        },
        fleetDetails: {
          operatorType: "Manlift Operator",
          equipmentDetails: "LAP-121121221 - Heavy Type",
          month: "2025-07",
          gatePassNumber: "GP123456",
          gatePassLocation: "RL",
          gateAccessNo: "1, 14",
          appHashNumber: "App543555",
          gatePassIssueDate: "2023-01-01",
          gatePassExpireDate: "2025-12-31",
          gatePassAttachment: null,
          gatePassExpireStatus: "Valid",
          fleetStatus: "Active",
        },
        trainingCertificationsDetails: {
          trainingTitle: "Certified Trainer",
          issueDate: "2023-01-01",
          expiryDate: "2023-01-06",
          idIqamaNo: "IQ335655",
          companyName: "Auto-Expert",
          description: "Training Certification",
          certifiedAs: "James Dafoe",
          trainingCertificate: null,
        },
        otherDetails: {
          dateOfJoin: "2023-01-01",
          designation: "Software Engineer",
          employeeType: "Operation",
          status: "Active",
          workPlace: "Qatar",
          departmentName: "IT",
          annualLeaveCount: 10,
          destinationCountry: "Qatar",
        },
        completionStatuses: {
          bank: "Not Available Now",
          other: "Not Available Now",
          career: "Yes",
          family: "Yes",
          license: "No",
          payroll: "No",
          sponsor: "Not Available Now",
          personal: "Yes",
          documents: "No",
          insurance: "Yes",
          fleet: "Yes",
          training: "Yes",
          contract: "Yes",
        },
      },
    ];

    await Employee.bulkCreate(sampleEmployees4, { ignoreDuplicates: true });
    console.log("Employees 4 successfully seeded!");

    // Seed data for 5th employee
    const sampleEmployees5 = [
      {
        personalDetails: {
          profileImage: "https://example.com/profile1.jpg",
          employeeNo: "AX-0005",
          fullNameEnglish: "Thomas Anderson",
          fullNameArabic: "جون دو",
          qidNumber: 7599457,
          passportNumber: "P1234567",
          qidExpireDate: "2026-12-31",
          passportExpireDate: "2026-12-31",
          recruitementType: "Local",
          visaNumber: "V1234567",
          nationality: "American",
          mobileNumber: "+97467895432",
          email: "thomas.anderson@example.com",
          gender: "Male",
          dateOfBirth: "1990-01-01",
          currentAddress: "123 Main St, City, Country",
          permanentAddress: "456 Permanent Rd, City, Country",
          maritalStatus: "Single",
        },
        drivingLicenseDetails: {
          isAvailableLicense: true,
          drivingLicenseCopy: null,
          licenseNumber: "DL12345",
          firstIssueDate: "2022-01-01",
          licenseExpireDate: "2023-01-01",
          licenseCategory: ["Excavator", "Crane"],
          licenseNotes: ["Glasses", "Automatic"],
        },
        bankDetails: {
          bankName: "ABC Bank",
          accountHolderName: "William Smith",
          accountNumber: 1234567890123456,
          branchName: "Main Branch",
          IBAN: "QA1234567890123456789",
          swiftCode: 1232333,
          shortCode: 12345,
        },
        sponserDetails: {
          sponserName: "Sponsored by Outside",
          employeeContractCopy: null,
          contractExpireDate: "2025-12-31",
          companyCRCopyExpireDate: "2025-12-31",
          computerCardCopy: null,
          computerCardExpireDate: "2025-12-31",
          NOC: null,
          companyCRCopy: null,
        },
        documentDetails: {
          image: null,
          copyOfQID: null,
          copyOfPassport: null,
          resume: null,
          qualificationCertificate: null,
          otherDocuments: null,
        },
        insuranceDetails: {
          healthCardNumber: "HC987654321",
          issuingAuthority: "Hamad Medical Corporation",
          expireDate: "2025-12-31",
          knownMedicalConditions: "Hypertension",
          allergies: "None",
          notesOrRemarks: "Requires monthly monitoring",
          policyNumber: "POL789123",
          coverageDetails: "Basic medical coverage, excludes dental",
          compensationExpireDate: "2026-12-31",
          insuranceProvider: "Al Koot Insurance",
          additionalPolicyDetails: "Excludes pre-existing conditions",
          attachments: null,
        },
        fleetDetails: {
          operatorType: "Manlift Operator",
          equipmentDetails: "LAP-121121221 - Heavy Type",
          month: "2025-07",
          gatePassNumber: "GP123456",
          gatePassLocation: "RL",
          gateAccessNo: "1, 14",
          appHashNumber: "App543555",
          gatePassIssueDate: "2023-01-01",
          gatePassExpireDate: "2025-12-31",
          gatePassAttachment: null,
          gatePassExpireStatus: "Valid",
          fleetStatus: "Active",
        },
        trainingCertificationsDetails: {
          trainingTitle: "Certified Trainer",
          issueDate: "2023-01-01",
          expiryDate: "2023-01-06",
          idIqamaNo: "IQ335655",
          companyName: "Auto-Expert",
          description: "Training Certification",
          certifiedAs: "James Dafoe",
          trainingCertificate: null,
        },
        otherDetails: {
          dateOfJoin: "2023-01-01",
          designation: "Software Engineer",
          employeeType: "Operation",
          status: "Active",
          workPlace: "Qatar",
          departmentName: "IT",
          annualLeaveCount: 10,
          destinationCountry: "Qatar",
        },
        completionStatuses: {
          bank: "Not Available Now",
          other: "Not Available Now",
          career: "Yes",
          family: "Yes",
          license: "No",
          payroll: "No",
          sponsor: "Not Available Now",
          personal: "Yes",
          documents: "No",
          insurance: "Yes",
          fleet: "Yes",
          training: "Yes",
          contract: "Yes",
        },
      },
    ];

    await Employee.bulkCreate(sampleEmployees5, { ignoreDuplicates: true });
    console.log("Employees 5 successfully seeded!");

    // Seed roles
    const roles = [
      { roleName: "Super Admin" },
      { roleName: "Admin" },
      { roleName: "User" },
    ];
    await UserRole.bulkCreate(roles, { ignoreDuplicates: true });

    // Find the Super Admin role
    const superAdminRole = await UserRole.findOne({
      where: { roleName: "Super Admin" },
    });

    // Hash the password
    const hashedPassword = await bcrypt.hash("password", 10);

    // Create a Super Admin user
    await User.create(
      {
        username: "super-admin",
        email: "super-admin@iteqsolution.com",
        password: hashedPassword,
        roleId: superAdminRole.id,
      },
      { ignoreDuplicates: true },
    );

    // Insert initial company profile data
    await CompanyProfileModel.create(
      {
        companyName: "ITEQ Solution",
        address: "123 Main St, Colombo, Sri Lanka",
        contactEmail: "info@iteqsolution.com",
        contactNumber: "+94776206033",
        website: "https://www.iteqsolution.com",
        logoUrl: "https://iteqsolution.com/assets/img/logo.png",
      },
      { ignoreDuplicates: true },
    );

    // Seed Organizations
    const organizations = [
      {
        organization: "Acme Corp",
        email: "contact@acmecorp.com",
        phone: "+1-555-123-4567",
        address: "123 Main St, New York, NY 10001",
        logo: "/logos/acme.png",
        description: "A leading tech company",
        country_uid: 1,
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        organization: "Global Solutions",
        email: "info@globalsolutions.com",
        phone: "+44-20-1234-5678",
        address: "456 High St, London, UK",
        logo: "/logos/global.png",
        description: "Global consulting firm",
        country_uid: 2,
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    await Organization.bulkCreate(organizations, { ignoreDuplicates: true });
    console.log("Organizations successfully seeded!");

    // Seed Tenants
    const tenants = [
      {
        organization_uid: 1,
        tenant: "acme-tenant-1",
        domain: "tenant1.acmecorp.com",
        email: "tenant1@acmecorp.com",
        phone: "+1-555-987-6543",
        address: "789 Elm St, New York, NY 10002",
        logo: "/logos/acme-tenant1.png",
        description: "Primary tenant for Acme Corp",
        country_uid: 1,
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        organization_uid: 2,
        tenant: "global-tenant-1",
        domain: "tenant1.globalsolutions.com",
        email: "tenant1@globalsolutions.com",
        phone: "+44-20-8765-4321",
        address: "123 Baker St, London, UK",
        logo: "/logos/global-tenant1.png",
        description: "Main tenant for Global Solutions",
        country_uid: 2,
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    await Tenants.bulkCreate(tenants, { ignoreDuplicates: true });
    console.log("Tenants successfully seeded!");

    // Seed Branches
    const branches = [
      {
        organization_uid: 1,
        tenant_uid: 1,
        branch_name: "Acme NY Branch",
        email: "nybranch@acmecorp.com",
        phone: "+1-555-111-2222",
        address: "101 Broadway, New York, NY 10003",
        logo: "/logos/acme-ny.png",
        description: "New York branch of Acme Corp",
        country_uid: 1,
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        organization_uid: 2,
        tenant_uid: 2,
        branch_name: "Global London Branch",
        email: "londonbranch@globalsolutions.com",
        phone: "+44-20-2222-3333",
        address: "789 Oxford St, London, UK",
        logo: "/logos/global-london.png",
        description: "London branch of Global Solutions",
        country_uid: 2,
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    await BranchesModel.bulkCreate(branches, { ignoreDuplicates: true });
    console.log("Branches successfully seeded!");

    // Seed User Management Roles
    const rolesData = [
      {
        role_name: "Super Admin",
        description: "Full access to all modules and settings",
        permissionCount: 0,
        status: "Active",
        is_business_role: false,
        tenant_uid: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_name: "Admin",
        description: "Manage tenant-specific modules",
        permissionCount: 143,
        status: "Active",
        is_business_role: true,
        tenant_uid: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_name: "Staff",
        description: "Limited access to specific modules",
        permissionCount: 143,
        status: "Active",
        is_business_role: true,
        tenant_uid: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    await UserManagementRoles.bulkCreate(rolesData, { ignoreDuplicates: true });
    console.log("Roles successfully seeded!");

    // Seed User Types
    const userTypes = [
      {
        user_type: "Admin",
        description: "Manage admin related modules",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_type: "Staff",
        description: "Manage staff related modules",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    await UserTypes.bulkCreate(userTypes, { ignoreDuplicates: true });
    console.log("User types successfully seeded!");

    // Seed User Groups
    const userGroups = [
      {
        group_name: "Employee Groups",
        description: "Manage employee groups",
        user_uid: [1, 2, 3, 4, 5],
        role_uid: [1, 2, 3],
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        group_name: "Commissions Groups",
        description: "Manage commissions groups",
        user_uid: [6, 7, 8],
        role_uid: [2, 3],
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        group_name: "Training Groups",
        description: "Manage training groups",
        user_uid: [9, 10, 11],
        role_uid: [2, 3],
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    await UserManagementUserGroups.bulkCreate(userGroups, {
      ignoreDuplicates: true,
    });
    console.log("User Groups successfully seeded!");

    // Seed Users

    // Hash the passwords
    const hashPasswordSuperAdmin = await bcrypt.hash("Pa$$word123", 10);
    const hashPasswordIteqAdmin = await bcrypt.hash("admin1iteq", 10);
    const hashPasswordIteqQA = await bcrypt.hash("qa1iteq", 10);

    const allUsers = [
      {
        username: "super-admin",
        email: "super-admin@iteqsolution.com",
        password: hashPasswordSuperAdmin,
        status: "Active",
        user_type_uid: 1,
        group_uid: [1],
        organization_uid: 1,
        tenant_uid: 1,
        branch_uid: 1,
        employeeId: 1,
        is_superadmin: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        username: "iteq-admin",
        email: "iteq-admin@iteqsolution.com",
        password: hashPasswordIteqAdmin,
        status: "Active",
        user_type_uid: 1,
        group_uid: [1],
        organization_uid: 1,
        tenant_uid: 1,
        branch_uid: 1,
        employeeId: 2,
        is_superadmin: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        username: "iteq-qa",
        email: "iteq-qa@iteqsolution.com",
        password: hashPasswordIteqQA,
        status: "Active",
        user_type_uid: 2,
        group_uid: [1],
        organization_uid: 1,
        tenant_uid: 1,
        branch_uid: 1,
        employeeId: 2,
        is_superadmin: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    await UserManagementUsers.bulkCreate(allUsers, {
      ignoreDuplicates: true,
    });
    console.log("Users successfully seeded!");

    // Seed Password Rules
    const passwordRules = [
      {
        user_type_uid: 1,
        min_length: 10,
        complexity_requirements:
          "Numbers: 1, Uppercase: 1, Special Characters: 1",
        expiration_days: 180,
        max_attempt: "3",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_type_uid: 2,
        min_length: 10,
        complexity_requirements:
          "Numbers: 1, Uppercase: 1, Special Characters: 1",
        expiration_days: 180,
        max_attempt: "3",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    await PasswordRules.bulkCreate(passwordRules, { ignoreDuplicates: true });
    console.log("Password rules successfully seeded!");

    // Seed Modules
    const modules = await ModulesModel.bulkCreate(
      [
        {
          module: "Sales CRM",
          description: "Manage sales crm related modules here",
          permission_name: [
            "sales-crm.all-pipelines.create",
            "sales-crm.all-pipelines.edit",
            "sales-crm.all-pipelines.delete",
          ],
          status: "Active",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          module: "Human Resources",
          description: "Manage human resource related modules here",
          permission_name: [
            "human-resources.all-employees.create",
            "human-resources.all-employees.edit",
            "human-resources.all-employees.delete",
          ],
          status: "Active",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          module: "Fixed Assests",
          description: "Manage fixed assets related modules here",
          permission_name: [
            "fixed-assests.all-asset.create",
            "fixed-assests.all-asset.edit",
            "fixed-assests.all-asset.delete",
          ],
          status: "Active",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          module: "Fleet Management",
          description: "Manage fleet management related modules here",
          permission_name: [
            "fleet-management.all-equipment.create",
            "fleet-management.all-equipment.edit",
            "fleet-management.all-equipment.delete",
          ],
          status: "Active",
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      { ignoreDuplicates: true },
    );

    // Bulk create permissions linked to the created modules

    const permissions = [
      {
        module_uid: modules[0].uid,
        permission: "sales-crm.all-pipelines.create",
        description: "Create new pipeline",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[0].uid,
        permission: "sales-crm.all-pipelines.edit",
        description: "Edit existing pipeline",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[0].uid,
        permission: "sales-crm.all-pipelines.delete",
        description: "Delete existing pipeline",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[0].uid,
        permission: "sales-crm.all-pipelines.view-list",
        description: "List all pipelines",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[0].uid,
        permission: "sales-crm.reports.view-list",
        description: "List all reports",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[0].uid,
        permission: "sales-crm.forms.create",
        description: "Create new form",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[0].uid,
        permission: "sales-crm.forms.publish",
        description: "Publish existing form",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[0].uid,
        permission: "sales-crm.forms.edit",
        description: "Edit existing form",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[0].uid,
        permission: "sales-crm.forms.delete",
        description: "Delete existing form",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[0].uid,
        permission: "sales-crm.forms.view-list",
        description: "List all forms",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[0].uid,
        permission: "sales-crm.all-leads.create",
        description: "Create new lead",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[0].uid,
        permission: "sales-crm.all-leads.edit",
        description: "Edit existing lead",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[0].uid,
        permission: "sales-crm.all-leads.view",
        description: "View existing lead",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[0].uid,
        permission: "sales-crm.all-leads.delete",
        description: "Delete existing lead",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[0].uid,
        permission: "sales-crm.all-leads.view-list",
        description: "List all leads",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[1].uid,
        permission: "hr.employees.create",
        description: "Create new employee",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[1].uid,
        permission: "hr.employees.edit",
        description: "Edit existing employee",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[1].uid,
        permission: "hr.employees.view",
        description: "View existing employee",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[1].uid,
        permission: "hr.employees.delete",
        description: "Delete existing employee",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[1].uid,
        permission: "hr.employees.view-list",
        description: "List all employees",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[1].uid,
        permission: "hr.job-postings.create",
        description: "Create new Job Post",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[1].uid,
        permission: "hr.job-postings.edit",
        description: "Edit existing Job Post",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[1].uid,
        permission: "hr.job-postings.view",
        description: "View existing Job Post",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[1].uid,
        permission: "hr.job-postings.approve",
        description: "Approve existing Job Post",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[1].uid,
        permission: "hr.job-postings.reject",
        description: "Reject existing Job Post",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[1].uid,
        permission: "hr.job-postings.create-template",
        description: "Create new Job Post Template",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[1].uid,
        permission: "hr.job-postings.delete",
        description: "Delete existing Job Post",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[1].uid,
        permission: "hr.job-postings.view-list",
        description: "List all Job Posts",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[1].uid,
        permission: "hr.job-onboarding.create",
        description: "Create new Job Onboard",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[1].uid,
        permission: "hr.job-onboarding.view",
        description: "View existing Job Onboard",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[1].uid,
        permission: "hr.job-onboarding.approve",
        description: "Approve existing Job Onboard",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[1].uid,
        permission: "hr.job-onboarding.reject",
        description: "Reject existing Job Onboard",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[1].uid,
        permission: "hr.job-onboarding.view-resume",
        description: "View existing Job Onboard Resume",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[1].uid,
        permission: "hr.job-onboarding.delete",
        description: "Delete existing Job Onboard",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[1].uid,
        permission: "hr.job-onboarding.view-list",
        description: "List all Job Onboards",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[1].uid,
        permission: "hr.employee-contract.template.create",
        description: "Create new employee contract template",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[1].uid,
        permission: "hr.employee-contract.template.edit",
        description: "Edit existing employee contract template",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[1].uid,
        permission: "hr.employee-contract.template.view",
        description: "View existing employee contract template",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[1].uid,
        permission: "hr.employee-contract.template.delete",
        description: "Delete existing employee contract template",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[1].uid,
        permission: "hr.employee-contract.template.view-list",
        description: "List all employee contract templates",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[1].uid,
        permission: "hr.employee-contract.generate-contract",
        description: "Generate employee contract",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[1].uid,
        permission: "hr.employee-contract.download-contract",
        description: "Download employee contract",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[1].uid,
        permission: "hr.employee-contract.activate-contract",
        description: "Activate existing employee contract",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[1].uid,
        permission: "hr.employee-contract.mark-complete-contract",
        description: "Mark complete existing employee contract",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[1].uid,
        permission: "hr.employee-contract.terminate-contract",
        description: "Terminate existing employee contract",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[1].uid,
        permission: "hr.employee-contract.view",
        description: "View existing employee contract",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[1].uid,
        permission: "hr.employee-contract.view-list",
        description: "List all employee contracts",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[1].uid,
        permission: "hr.payrolls.automate",
        description: "Automate new payroll",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[1].uid,
        permission: "hr.payrolls.edit",
        description: "Edit existing payroll",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[1].uid,
        permission: "hr.payrolls.view",
        description: "View existing payroll",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[1].uid,
        permission: "hr.payrolls.approve",
        description: "Approve existing payroll",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[1].uid,
        permission: "hr.payrolls.reject",
        description: "Reject existing payroll",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[1].uid,
        permission: "hr.payrolls.create-commission",
        description: "Create new commission",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[1].uid,
        permission: "hr.payrolls.view-commission-list",
        description: "List all commissions",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[1].uid,
        permission: "hr.payrolls.view-list",
        description: "List all payrolls",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[1].uid,
        permission: "hr.provisions.gratuity-provision.automate",
        description: "Automate new gratuity provision",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[1].uid,
        permission: "hr.provisions.gratuity-provision.edit",
        description: "Edit existing gratuity provision",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[1].uid,
        permission: "hr.provisions.gratuity-provision.view",
        description: "View existing gratuity provision",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[1].uid,
        permission: "hr.provisions.gratuity-provision.delete",
        description: "Delete existing gratuity provision",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[1].uid,
        permission: "hr.provisions.gratuity-provision.view-list",
        description: "List all gratuity provisions",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[1].uid,
        permission: "hr.provisions.annual-leave-provision.calculate",
        description: "Calculate new annual leave provision",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[1].uid,
        permission: "hr.provisions.annual-leave-provision.view-list",
        description: "List all annual leave provisions",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[1].uid,
        permission: "hr.provisions.air-ticket-provision.calculate",
        description: "Calculate new air ticket provision",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[1].uid,
        permission: "hr.provisions.air-ticket-provision.view-list",
        description: "List all air ticket provisions",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[1].uid,
        permission: "hr.leave-approval.create",
        description: "Create new leave approval",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[1].uid,
        permission: "hr.leave-approval.view",
        description: "View existing leave approval",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[1].uid,
        permission: "hr.leave-approval.approve",
        description: "Approve existing leave approval",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[1].uid,
        permission: "hr.leave-approval.reject",
        description: "Reject existing leave approval",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[1].uid,
        permission: "hr.leave-approval.view-list",
        description: "List all leave approvals",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[1].uid,
        permission: "hr.loan-approval.create",
        description: "Create new loan approval",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[1].uid,
        permission: "hr.loan-approval.view",
        description: "View existing loan approval",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[1].uid,
        permission: "hr.loan-approval.approve",
        description: "Approve existing loan approval",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[1].uid,
        permission: "hr.loan-approval.reject",
        description: "Reject existing loan approval",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[1].uid,
        permission: "hr.loan-approval.view-list",
        description: "List all loan approvals",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[1].uid,
        permission: "hr.penalties.create",
        description: "Create new penalty",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[1].uid,
        permission: "hr.penalties.view",
        description: "View existing penalty",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[1].uid,
        permission: "hr.penalties.update-deduction",
        description: "Edit existing penalty deduction details",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[1].uid,
        permission: "hr.penalties.view-list",
        description: "List all penalties",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[1].uid,
        permission: "hr.commissions.view",
        description: "View existing commission",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[1].uid,
        permission: "hr.commissions.view-list",
        description: "List all commissions",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[1].uid,
        permission: "hr.attendance.create",
        description: "Create new attendance",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[1].uid,
        permission: "hr.attendance.edit",
        description: "Edit existing attendance",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[1].uid,
        permission: "hr.attendance.view",
        description: "View existing attendance",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[1].uid,
        permission: "hr.attendance.clock-in",
        description: "Clock in new attendance",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[1].uid,
        permission: "hr.attendance.clock-out",
        description: "Clock out existing attendance",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[1].uid,
        permission: "hr.attendance.delete",
        description: "Delete existing attendance",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[1].uid,
        permission: "hr.attendance.view-list",
        description: "List all attendances",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[1].uid,
        permission: "hr.self-service-portal.pay-slip.view",
        description: "View pay slip",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[1].uid,
        permission: "hr.self-service-portal.leave-request-portal.create",
        description: "Create new leave request",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[1].uid,
        permission: "hr.self-service-portal.leave-request-portal.view",
        description: "View existing leave request",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[1].uid,
        permission: "hr.self-service-portal.leave-request-portal.view-list",
        description: "List all leave requests",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[1].uid,
        permission: "hr.self-service-portal.loan-request-portal.create",
        description: "Create new loan request",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[1].uid,
        permission: "hr.self-service-portal.loan-request-portal.view",
        description: "View existing loan request",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[1].uid,
        permission: "hr.self-service-portal.loan-request-portal.view-list",
        description: "List all loan requests",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[1].uid,
        permission: "hr.self-service-portal.training-details.view",
        description: "View training details",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[1].uid,
        permission: "hr.performance-management.create",
        description: "Create new performance management record",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[1].uid,
        permission: "hr.performance-management.edit",
        description: "Edit existing performance management record",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[1].uid,
        permission: "hr.performance-management.view",
        description: "View existing performance management record",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[1].uid,
        permission: "hr.performance-management.delete",
        description: "Delete existing performance management record",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[1].uid,
        permission: "hr.performance-management.view-list",
        description: "List all performance management records",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[1].uid,
        permission: "hr.training-and-development.create",
        description: "Create new training and development record",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[1].uid,
        permission: "hr.training-and-development.edit",
        description: "Edit existing training and development record",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[1].uid,
        permission: "hr.training-and-development.view",
        description: "View existing training and development record",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[1].uid,
        permission: "hr.training-and-development.delete",
        description: "Delete existing training and development record",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[1].uid,
        permission: "hr.training-and-development.view-list",
        description: "List all training and development records",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[1].uid,
        permission: "hr.settings.create",
        description: "Create new setting record",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[1].uid,
        permission: "hr.settings.edit",
        description: "Edit existing setting record",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[1].uid,
        permission: "hr.settings.view",
        description: "View existing setting record",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[1].uid,
        permission: "hr.settings.delete",
        description: "Delete existing setting record",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[1].uid,
        permission: "hr.settings.view-list",
        description: "List all setting records",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[2].uid,
        permission: "fixed-assets.asset-classification.create",
        description: "Create new asset classification",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[2].uid,
        permission: "fixed-assets.asset-classification.edit",
        description: "Edit existing asset classification",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[2].uid,
        permission: "fixed-assets.asset-classification.view",
        description: "View existing asset classification",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[2].uid,
        permission: "fixed-assets.asset-classification.delete",
        description: "Delete existing asset classification",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[2].uid,
        permission: "fixed-assets.asset-classification.view-list",
        description: "List all asset classifications",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[2].uid,
        permission: "fixed-assets.assets-management.assets.create",
        description: "Create new asset",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[2].uid,
        permission: "fixed-assets.assets-management.assets.edit",
        description: "Edit existing asset",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[2].uid,
        permission: "fixed-assets.assets-management.assets.view",
        description: "View existing asset",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[2].uid,
        permission: "fixed-assets.assets-management.assets.delete",
        description: "Delete existing asset",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[2].uid,
        permission: "fixed-assets.assets-management.assets.view-list",
        description: "List all assets",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[2].uid,
        permission: "fixed-assets.assets-management.sub-assets.create",
        description: "Create new sub asset",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[2].uid,
        permission: "fixed-assets.assets-management.sub-assets.edit",
        description: "Edit existing sub asset",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[2].uid,
        permission: "fixed-assets.assets-management.sub-assets.view",
        description: "View existing sub asset",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[2].uid,
        permission: "fixed-assets.assets-management.sub-assets.delete",
        description: "Delete existing sub asset",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[2].uid,
        permission: "fixed-assets.assets-management.sub-assets.view-list",
        description: "List all sub assets",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[2].uid,
        permission: "fixed-assets.depreciation-schedules.automate",
        description: "Automate new depreciation schedule",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[2].uid,
        permission: "fixed-assets.depreciation-schedules.edit",
        description: "Edit existing depreciation schedule",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[2].uid,
        permission: "fixed-assets.depreciation-schedules.view",
        description: "View existing depreciation schedule",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[2].uid,
        permission: "fixed-assets.depreciation-schedules.approve",
        description: "Approve existing depreciation schedule",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[2].uid,
        permission: "fixed-assets.depreciation-schedules.reject",
        description: "Reject existing depreciation schedule",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[2].uid,
        permission: "fixed-assets.depreciation-schedules.delete",
        description: "Delete existing depreciation schedule",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[2].uid,
        permission: "fixed-assets.depreciation-schedules.view-list",
        description: "List all depreciation schedules",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[2].uid,
        permission: "fixed-assets.assets-transfers.create",
        description: "Create new asset transfer",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[2].uid,
        permission: "fixed-assets.assets-transfers.edit",
        description: "Edit existing asset transfer",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[2].uid,
        permission: "fixed-assets.assets-transfers.view",
        description: "View existing asset transfer",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[2].uid,
        permission: "fixed-assets.assets-transfers.delete",
        description: "Delete existing asset transfer",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[2].uid,
        permission: "fixed-assets.assets-transfers.view-list",
        description: "List all asset transfers",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[2].uid,
        permission: "fixed-assets.assets-disposals.create",
        description: "Create new asset disposal",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[2].uid,
        permission: "fixed-assets.assets-disposals.edit",
        description: "Edit existing asset disposal",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[2].uid,
        permission: "fixed-assets.assets-disposals.view",
        description: "View existing asset disposal",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[2].uid,
        permission: "fixed-assets.assets-disposals.delete",
        description: "Delete existing asset disposal",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[2].uid,
        permission: "fixed-assets.assets-disposals.view-list",
        description: "List all asset disposals",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[2].uid,
        permission: "fixed-assets.settings.create",
        description: "Create new setting record",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[2].uid,
        permission: "fixed-assets.settings.edit",
        description: "Edit existing setting record",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[2].uid,
        permission: "fixed-assets.settings.view",
        description: "View existing setting record",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[2].uid,
        permission: "fixed-assets.settings.delete",
        description: "Delete existing setting record",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[2].uid,
        permission: "fixed-assets.settings.view-list",
        description: "List all setting records",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[2].uid,
        permission: "fixed-assets.settings.asset.category.create",
        description: "Create new category",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[2].uid,
        permission: "fixed-assets.settings.asset.category.edit",
        description: "Edit existing category",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[2].uid,
        permission: "fixed-assets.settings.asset.category.view",
        description: "View existing category",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[2].uid,
        permission: "fixed-assets.settings.asset.category.delete",
        description: "Delete existing category",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[2].uid,
        permission: "fixed-assets.settings.asset.category.view-list",
        description: "List all categories",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[2].uid,
        permission: "fixed-assets.settings.asset.sub-category.create",
        description: "Create new sub category",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[2].uid,
        permission: "fixed-assets.settings.asset.sub-category.edit",
        description: "Edit existing sub category",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[2].uid,
        permission: "fixed-assets.settings.asset.sub-category.view",
        description: "View existing sub category",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[2].uid,
        permission: "fixed-assets.settings.asset.sub-category.delete",
        description: "Delete existing sub category",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[2].uid,
        permission: "fixed-assets.settings.asset.sub-category.view-list",
        description: "List all sub categories",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[2].uid,
        permission: "fixed-assets.settings.asset.capacity.create",
        description: "Create new capacity",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[2].uid,
        permission: "fixed-assets.settings.asset.capacity.edit",
        description: "Edit existing capacity",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[2].uid,
        permission: "fixed-assets.settings.asset.capacity.view",
        description: "View existing capacity",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[2].uid,
        permission: "fixed-assets.settings.asset.capacity.delete",
        description: "Delete existing capacity",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[2].uid,
        permission: "fixed-assets.settings.asset.capacity.view-list",
        description: "List all capacities",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[3].uid,
        permission: "fleet-management.fleet-dashboard.view-list",
        description: "List all fleet records",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[3].uid,
        permission: "fleet-management.fleet-dashboard.resolve-alert",
        description: "Resolve the alert records",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[3].uid,
        permission: "fleet-management.master-list.equipment.create",
        description: "Create new equipment",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[3].uid,
        permission: "fleet-management.master-list.equipment.edit",
        description: "Edit existing equipment",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[3].uid,
        permission: "fleet-management.master-list.equipment.view",
        description: "View existing equipment",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[3].uid,
        permission: "fleet-management.master-list.equipment.delete",
        description: "Delete existing equipment",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[3].uid,
        permission: "fleet-management.master-list.equipment.view-list",
        description: "List all equipments",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[3].uid,
        permission:
          "fleet-management.master-list.equipment.work-schedule.create",
        description: "Create new equipment work schedule",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[3].uid,
        permission: "fleet-management.master-list.equipment.work-schedule.edit",
        description: "Edit existing equipment work schedule",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[3].uid,
        permission:
          "fleet-management.master-list.equipment.work-schedule.delete",
        description: "Delete existing equipment work schedule",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[3].uid,
        permission: "fleet-management.master-list.equipment.work-schedule.view",
        description: "View existing equipment work schedule",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[3].uid,
        permission:
          "fleet-management.master-list.equipment.work-schedule.view-list",
        description: "List all equipment work schedules",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[3].uid,
        permission: "fleet-management.master-list.manpower.edit",
        description: "Edit existing manpower",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[3].uid,
        permission: "fleet-management.master-list.manpower.view",
        description: "View existing manpower",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[3].uid,
        permission: "fleet-management.master-list.manpower.delete",
        description: "Delete existing manpower",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[3].uid,
        permission: "fleet-management.master-list.manpower.view-list",
        description: "List all manpowers",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[3].uid,
        permission:
          "fleet-management.master-list.manpower.work-schedule.create",
        description: "Create new manpower work schedule",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[3].uid,
        permission: "fleet-management.master-list.manpower.work-schedule.edit",
        description: "Edit existing manpower work schedule",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[3].uid,
        permission:
          "fleet-management.master-list.manpower.work-schedule.delete",
        description: "Delete existing manpower work schedule",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[3].uid,
        permission: "fleet-management.master-list.manpower.work-schedule.view",
        description: "View existing manpower work schedule",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[3].uid,
        permission:
          "fleet-management.master-list.manpower.work-schedule.view-list",
        description: "List all manpower work schedules",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[3].uid,
        permission: "fleet-management.master-list.maintenance.create",
        description: "Create new maintenance",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[3].uid,
        permission: "fleet-management.master-list.maintenance.edit",
        description: "Edit existing maintenance",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[3].uid,
        permission: "fleet-management.master-list.maintenance.view",
        description: "View existing maintenance",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[3].uid,
        permission: "fleet-management.master-list.maintenance.delete",
        description: "Delete existing maintenance",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[3].uid,
        permission: "fleet-management.master-list.maintenance.view-list",
        description: "List all maintenances",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[3].uid,
        permission: "fleet-management.sales-order.create",
        description: "Create new sales order",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[3].uid,
        permission: "fleet-management.sales-order.edit",
        description: "Edit existing sales order",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[3].uid,
        permission: "fleet-management.sales-order.view",
        description: "View existing sales order",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[3].uid,
        permission: "fleet-management.sales-order.delete",
        description: "Delete existing sales order",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[3].uid,
        permission: "fleet-management.sales-order.view-allocate-resources",
        description: "View existing sales order allocate resources",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[3].uid,
        permission: "fleet-management.sales-order.view-list",
        description: "List all sales orders",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[3].uid,
        permission: "fleet-management.products.create",
        description: "Create new product",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[3].uid,
        permission: "fleet-management.products.edit",
        description: "Edit existing product",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[3].uid,
        permission: "fleet-management.products.view",
        description: "View existing product",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[3].uid,
        permission: "fleet-management.products.delete",
        description: "Delete existing product",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[3].uid,
        permission: "fleet-management.products.view-list",
        description: "List all products",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[3].uid,
        permission:
          "fleet-management.handle-active-allocations.select-sales-order",
        description: "Select sales order to handle active allocations",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[3].uid,
        permission:
          "fleet-management.handle-active-allocations.select-resources",
        description: "Select resources to handle active allocations",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[3].uid,
        permission:
          "fleet-management.handle-active-allocations.schedule-allocations",
        description: "Schedule active allocations",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[3].uid,
        permission:
          "fleet-management.operational-handling.active-allocations.view",
        description: "View existing active allocation",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[3].uid,
        permission:
          "fleet-management.operational-handling.active-allocations.view-list",
        description: "List all active allocations",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[3].uid,
        permission:
          "fleet-management.operational-handling.all-allocations.view",
        description: "View existing allocation",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[3].uid,
        permission:
          "fleet-management.operational-handling.all-allocations.view-list",
        description: "List all allocations",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[3].uid,
        permission: "fleet-management.operational-handling.breakdown.create",
        description: "Create new breakdown",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[3].uid,
        permission: "fleet-management.operational-handling.breakdown.edit",
        description: "Edit existing breakdown",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[3].uid,
        permission: "fleet-management.operational-handling.breakdown.view-list",
        description: "List all breakdowns",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[3].uid,
        permission:
          "fleet-management.operational-handling.handheld-event.create",
        description: "Create new handheld event",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[3].uid,
        permission: "fleet-management.operational-handling.handheld-event.edit",
        description: "Edit existing handheld event",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[3].uid,
        permission:
          "fleet-management.operational-handling.handheld-event.view-list",
        description: "List all handheld events",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[3].uid,
        permission:
          "fleet-management.operational-handling.coordinator-task.create",
        description: "Create new coordinator task",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[3].uid,
        permission:
          "fleet-management.operational-handling.coordinator-task.edit",
        description: "Edit existing coordinator task",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[3].uid,
        permission:
          "fleet-management.operational-handling.coordinator-task.view-list",
        description: "List all coordinator tasks",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[3].uid,
        permission: "fleet-management.settings.create",
        description: "Create new setting record",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[3].uid,
        permission: "fleet-management.settings.edit",
        description: "Edit existing setting record",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[3].uid,
        permission: "fleet-management.settings.view",
        description: "View existing setting record",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[3].uid,
        permission: "fleet-management.settings.delete",
        description: "Delete existing setting record",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        module_uid: modules[3].uid,
        permission: "fleet-management.settings.view-list",
        description: "List all setting records",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];
    await Permissions.bulkCreate(permissions, { ignoreDuplicates: true });

    // Seed role permissions
    const rolePermissions = [
      {
        role_uid: 2, // Admin role
        permission_uid: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 2,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 3,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 4,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 5,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 6,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 7,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 8,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 9,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 10,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 11,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 12,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 13,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 14,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 15,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 16,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 17,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 18,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 19,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 20,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 21,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 22,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 23,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 24,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 25,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 26,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 27,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 28,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 29,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 30,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 31,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 32,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 33,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 34,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 35,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 36,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 37,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 38,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 39,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 40,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 41,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 42,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 43,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 44,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 45,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 46,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 47,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 48,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 49,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 50,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 51,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 52,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 53,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 54,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 55,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 56,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 57,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 58,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 59,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 60,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 61,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 62,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 63,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 64,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 65,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 66,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 67,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 68,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 69,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 70,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 71,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 72,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 73,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 74,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 75,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 76,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 77,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 78,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 79,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 80,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 81,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 82,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 83,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 84,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 85,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 86,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 87,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 88,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 89,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 90,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 91,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 92,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 93,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 94,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 95,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 96,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 97,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 98,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 99,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 100,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 101,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 102,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 103,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 104,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 105,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 106,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 107,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 108,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 109,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 110,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 111,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 112,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 113,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 114,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 115,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 116,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 117,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 118,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 119,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 120,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 121,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 122,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 123,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 124,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 125,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 126,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 127,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 128,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 129,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 130,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 131,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 132,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 133,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 134,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 135,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 136,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 137,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 138,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 139,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 140,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 141,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 142,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 143,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 144,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 145,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 146,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 147,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 148,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 149,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 150,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 151,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 152,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 153,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 154,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 155,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 156,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 157,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 158,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 159,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 160,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 161,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 162,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 163,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 164,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 165,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 166,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 167,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 168,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 169,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 170,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 171,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 172,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 173,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 174,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 175,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 176,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 177,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 178,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 179,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 180,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 181,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 182,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 183,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 184,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 185,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 186,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 187,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 188,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 189,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 190,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 191,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 192,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 193,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 194,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 195,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 196,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 197,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 198,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 199,
        created_at: new Date(),
        updated_at: new Date(),
      },

      {
        role_uid: 2, // Admin role
        permission_uid: 200,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 201,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 202,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 203,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 204,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 205,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 206,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 207,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 208,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 209,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 210,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 211,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 212,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 213,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 214,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 215,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 216,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 217,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 218,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 219,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 2, // Admin role
        permission_uid: 220,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 2,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 3,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 4,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 5,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 6,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 7,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 8,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 9,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 10,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 11,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 12,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 13,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 14,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 15,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 16,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 17,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 18,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 19,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 20,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 21,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 22,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 23,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 24,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 25,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 26,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 27,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 28,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 29,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 30,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 31,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 32,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 33,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 34,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 35,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 36,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 37,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 38,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 39,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 40,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 41,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 42,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 43,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 44,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 45,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 46,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 47,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 48,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 49,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 50,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 51,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 52,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 53,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 54,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 55,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 56,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 57,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 58,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 59,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 60,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 61,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 62,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 63,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 64,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 65,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 66,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 67,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 68,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 69,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 70,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 71,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 72,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 73,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 74,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 75,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 76,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 77,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 78,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 79,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 80,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 81,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 82,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 83,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 84,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 85,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 86,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 87,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 88,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 89,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 90,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 91,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 92,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 93,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 94,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 95,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 96,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 97,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 98,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 99,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 100,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 101,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 102,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 103,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 104,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 105,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 106,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 107,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 108,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 109,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 110,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 111,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 112,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 113,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 114,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 115,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 116,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 117,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 118,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 119,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 120,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 121,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 122,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 123,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 124,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 125,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 126,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 127,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 128,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 129,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 130,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 131,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 132,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 133,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 134,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 135,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 136,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 137,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 138,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 139,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 140,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 141,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 142,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 143,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 144,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 145,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 146,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 147,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 148,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 149,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 150,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 151,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 152,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 153,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 154,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 155,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 156,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 157,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 158,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 159,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 160,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 161,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 162,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 163,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 164,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 165,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 166,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 167,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 168,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 169,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 170,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 171,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 172,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 173,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 174,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 175,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 176,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 177,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 178,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 179,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 180,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 181,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 182,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 183,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 184,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 185,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 186,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 187,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 188,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 189,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 190,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 191,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 192,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 193,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 194,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 195,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 196,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 197,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 198,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 199,
        created_at: new Date(),
        updated_at: new Date(),
      },

      {
        role_uid: 3, // Staff role
        permission_uid: 200,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 201,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 202,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 203,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 204,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 205,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 206,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 207,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 208,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 209,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 210,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 211,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 212,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 213,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 214,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 215,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 216,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 217,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 218,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 219,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_uid: 3, // Staff role
        permission_uid: 220,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    await RolePermissions.bulkCreate(rolePermissions, {
      ignoreDuplicates: true,
    });
    console.log("Role permissions successfully seeded!");


    console.log("User Management Database seeded successfully with ITEQ Solution data.");
  } catch (error) {
    console.error("Error inserting initial data:", error);
  }
};

module.exports = seedDatabase;
