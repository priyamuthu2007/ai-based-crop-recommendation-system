const form = document.querySelector('#recommendation-form');
const cropName = document.querySelector('#crop-name');
const confidenceValue = document.querySelector('#confidence-value');
const confidenceBar = document.querySelector('#confidence-bar');
const recommendationList = document.querySelector('#recommendation-list');
const alternatives = document.querySelector('.alternatives');
const whyCrop = document.querySelector('.why-crop');
const reasonList = document.querySelector('#reason-list');
const resetButton = document.querySelector('#reset-button');
const submitButton = document.querySelector('#recommendation-form .primary-button');
const resultPanel = document.querySelector('.result-panel');
const languageSelect = document.querySelector('#language-select');
const authLanguageSelect = document.querySelector('#auth-language-select');
const authScreen = document.querySelector('#auth-screen');
const appShell = document.querySelector('.app-shell');
const authForm = document.querySelector('#auth-form');
const authStatus = document.querySelector('#auth-status');
const authTitle = document.querySelector('#auth-title');
const authIntro = document.querySelector('.auth-intro');
const authSubmit = document.querySelector('#auth-submit');
const nameField = document.querySelector('#name-field');
const authName = document.querySelector('#auth-name');
const authPassword = document.querySelector('#auth-password');
const loginModeButton = document.querySelector('#login-mode-button');
const registerModeButton = document.querySelector('#register-mode-button');
const logoutButton = document.querySelector('#logout-button');
const locationInput = document.querySelector('#location-input');
const weatherButton = document.querySelector('#weather-button');
const locationButton = document.querySelector('#location-button');
const weatherStatus = document.querySelector('#weather-status');
const reportFile = document.querySelector('#report-file');
const reportDropzone = document.querySelector('#report-dropzone');
const reportFileName = document.querySelector('#report-file-name');
const ocrButton = document.querySelector('#ocr-button');
const ocrStatus = document.querySelector('#ocr-status');
const ocrReviewRow = document.querySelector('#ocr-review-row');
const ocrReview = document.querySelector('#ocr-review');
const trainingWarning = document.querySelector('#training-warning');
const voiceButton = document.querySelector('#voice-button');
const voiceStatus = document.querySelector('#voice-status');

const translations = {
  en: {
    season: 'Kharif season', navHome: 'Home', navRecommendation: 'Recommendation', navSoil: 'Soil profile',
    navHistory: 'Past results', needHelp: 'Need help?', talkExpert: 'Talk to an agronomist',
    language: 'Language', eyebrow: 'FIELD DECISION SUPPORT', pageTitle: 'What should you plant next?',
    welcomeEyebrow: 'A clearer path from soil to season', welcomeTitle: 'Make your next crop count.',
    welcomeText: "Enter today's field conditions and Fieldwise will find the best crop match for your land.",
    weatherSummary: 'Weather appears here after autofill', stepInputs: 'STEP 01 / FIELD INPUTS',
    inputsTitle: 'Tell us about your field', required: 'All fields required',
    weatherTitle: 'Weather autofill', locationLabel: 'Town or village', locationPlaceholder: 'e.g. Coimbatore',
    weatherButton: 'Fill weather', locationButton: 'Use my location',
    rainfallNote: 'Rainfall is the Open-Meteo total forecast for the next 16 days. Review it before use; the model data may represent a different rainfall period.',
    reportTitle: 'Soil test report', reportLabel: 'Choose a photo or PDF', ocrButton: 'Read N, P, K and pH',
    reportDropTitle: 'Drop your soil report here', reportDropText: 'or choose a photo or PDF from your device',
    reportNoFile: 'No report selected', reportUploadHint: 'JPG, PNG or PDF · up to 15 MB',
    ocrNote: 'English-labeled reports only. The report is processed in this browser and is not uploaded. Check extracted values and units.',
    ocrReview: 'I checked the extracted soil values and units against my report.',
    voiceTitle: 'Voice input', voiceButton: 'Speak field values',
    voicePrompt: 'Say values with labels, for example: nitrogen 90, phosphorus 42, pH 6.5.',
    voiceNote: 'Speech recognition availability and privacy depend on your browser.',
    authEyebrow: 'YOUR FARM, YOUR FIELDWISE ACCOUNT', loginTitle: 'Welcome back',
    authStoryEyebrow: 'GROW WITH GREATER CLARITY',
    authStoryTitle: 'Your field has a story. Make your next season count.',
    authStoryText: 'Bring soil details and local weather together to explore crop options with confidence.',
    authStoryTagOne: 'Soil-aware', authStoryTagTwo: 'Weather-ready', authStoryTagThree: 'Farmer-first',
    authStoryFoot: 'Thoughtful decisions, rooted in your field.',
    authIntro: 'Sign in to get crop recommendations for your farm.',
    registerIntro: 'Create a Fieldwise account to save your farmer profile.',
    loginTab: 'Sign in', registerTab: 'Create account', nameLabel: 'Your name',
    emailLabel: 'Email address', passwordLabel: 'Password',
    passwordHint: 'Use at least 8 characters.', loginButton: 'Sign in',
    registerButton: 'Create account',
    authPrivacy: 'Your account is stored by this app. Your password is never stored as plain text.',
    logoutButton: 'Sign out', signInExpired: 'Your session has expired. Please sign in again.',
    accountCreated: 'Account created. You are now signed in.',
    signedIn: 'Signed in successfully.', signedOut: 'You have signed out.',
    homeGreeting: (name) => `Welcome to your field, ${name}.`,
    homeTopbarEyebrow: 'FIELDWISE · FARM OVERVIEW',
    homeTopbarTitle: 'Your field, your next season.',
    homeEyebrow: 'FIELDWISE · YOUR FARMING COMPANION',
    homeTitle: 'Better planting decisions start with your field.',
    homeText: 'Bring your soil and growing conditions together to explore crop options made for your field.',
    homePrimaryAction: 'Start a recommendation', homeSecondaryAction: 'Add soil details',
    homeTrustNote: 'A clear starting point—always review suggestions with local expertise.',
    homeArtTitle: 'Rooted in your field', homeArtText: 'Soil · climate · crop fit',
    homeMetricCrops: 'crops in the dataset', homeMetricInputs: 'field indicators',
    homeMetricMatches: 'ranked crop matches',
    homeStepsEyebrow: 'A SIMPLE WAY TO GET STARTED',
    homeStepsTitle: 'From field details to a clearer shortlist.',
    homeExploreLink: 'Explore recommendations',
    homeStepOneTitle: 'Add your field profile',
    homeStepOneText: 'Enter soil values, or use a report and check every extracted number.',
    homeStepTwoTitle: 'Bring in local conditions',
    homeStepTwoText: 'Use weather autofill as a helpful starting point and review the forecast.',
    homeStepThreeTitle: 'Compare the crop matches',
    homeStepThreeText: 'See three ranked options and the field factors behind the top match.',
    nitrogen: 'Nitrogen', phosphorus: 'Phosphorus', potassium: 'Potassium',
    temperature: 'Temperature', humidity: 'Humidity', soilPh: 'Soil pH',
    rainfall: 'Expected rainfall', recommendButton: 'Get crop recommendation',
    privacyNote: 'Soil reports stay in this browser; weather requests use Open-Meteo.',
    stepResult: 'STEP 02 / RESULT', resultTitle: 'Your best match', recommendedCrop: 'Recommended crop',
    modelBadge: 'Profile match', growingPeriod: 'Growing period', waterNeed: 'Water need', waterHigh: 'High',
    resultPlaceholder: 'Submit your field conditions to see suitable crops.',
    profileSimilarity: 'Profile similarity (not probability)', otherMatches: 'Other top matches',
    whyCrop: 'Why this crop?', emptyResult: 'Enter your field details to see a recommendation.',
    recommendationCaveat: 'Prototype decision support only. Similarity scores are not probabilities; confirm recommendations and local conditions with an agricultural expert.',
    trainingRangeWarning: (items) => `Outside this dataset's observed range: ${items}. The match may be unreliable; verify the inputs and consult a local agricultural expert.`,
    reviewOcrFirst: 'Please confirm the OCR-extracted soil values and units before requesting a crop match.',
    resetButton: 'Reset field inputs', footerText: 'Designed for practical decisions in the field',
    weatherSearching: 'Looking up location and weather…',
    weatherSuccess: (place, temp, humidity, rainfall) => `Weather filled for ${place}: ${temp}°C, ${humidity}% humidity, and ${rainfall} mm forecast rain over 16 days. Review the rainfall period.`,
    weatherFailure: 'Could not retrieve weather. Check the place name and your internet connection.',
    locationUnavailable: 'Location access is unavailable in this browser.',
    locationDenied: 'Location access was denied. Enter a town or village instead.',
    weatherForecast: 'Forecast', ocrMissingFile: 'Choose an image or PDF report first.',
    ocrUnsupported: 'OCR libraries could not be loaded. Check your internet connection and try again.',
    ocrWorking: 'Reading report in your browser…', ocrNoValues: 'Could not find N, P, K or pH. Enter the values manually.',
    ocrSuccess: (count, missing) => `Filled ${count} value(s).${missing ? ` Not found: ${missing}.` : ''} Please verify the values and units.`,
    ocrInvalid: (name) => `The extracted ${name} value is outside the accepted range and was not filled.`,
    ocrFailed: (message) => `Could not read this report: ${message}`,
    voiceUnsupported: 'Voice input is not supported by this browser. You can still type the values.',
    voiceListening: 'Listening… say a field name followed by its value.',
    voiceNoValues: 'No labeled numbers were recognized. Try saying “nitrogen 90, phosphorus 42, pH 6.5”.',
    voiceSuccess: (count) => `Filled ${count} value(s) from speech. Please check them before continuing.`,
    voiceFailed: 'Voice input failed. Check microphone permission and try again.',
    analysing: 'Analysing field…', requestFailed: 'Unable to get recommendation.',
    recommendationFailed: 'Could not generate a recommendation.',
    whyTemplate: (feature, value, unit, crop) => `${feature} ${value}${unit ? ` ${unit}` : ''} is close to ${crop}'s typical profile.`,
    recommendationMessage: (crop) => `Your field conditions show a good profile match for ${crop}.`,
  },
  ta: {
    season: 'காரிப் பருவம்', navHome: 'முகப்பு', navRecommendation: 'பரிந்துரை', navSoil: 'மண் விவரம்',
    navHistory: 'முந்தைய முடிவுகள்', needHelp: 'உதவி வேண்டுமா?', talkExpert: 'வேளாண் நிபுணரிடம் பேசுங்கள்',
    language: 'மொழி', eyebrow: 'வயல் முடிவு ஆதரவு', pageTitle: 'அடுத்து என்ன பயிரிடலாம்?',
    welcomeEyebrow: 'மண்ணிலிருந்து பருவம் வரை தெளிவான வழி', welcomeTitle: 'அடுத்த பயிரைச் சிறப்பாகத் தேர்ந்தெடுங்கள்.',
    welcomeText: 'உங்கள் வயல் விவரங்களை உள்ளிடுங்கள்; பொருத்தமான பயிரை Fieldwise பரிந்துரைக்கும்.',
    weatherSummary: 'வானிலை தானாக நிரப்பியதும் இங்கே தெரியும்', stepInputs: 'படி 01 / வயல் விவரங்கள்',
    inputsTitle: 'உங்கள் வயலைப் பற்றிச் சொல்லுங்கள்', required: 'அனைத்து விவரங்களும் தேவை',
    weatherTitle: 'வானிலை தானாக நிரப்புதல்', locationLabel: 'ஊர் அல்லது கிராமம்', locationPlaceholder: 'எ.கா. கோயம்புத்தூர்',
    weatherButton: 'வானிலையை நிரப்பு', locationButton: 'என் இருப்பிடத்தைப் பயன்படுத்து',
    rainfallNote: 'மழையளவு Open-Meteo வழங்கும் அடுத்த 16 நாட்களுக்கான மொத்த முன்னறிவிப்பு. பயன்படுத்தும் முன் சரிபார்க்கவும்; மாதிரி தரவு வேறு கால அளவைக் குறிக்கலாம்.',
    reportTitle: 'மண் பரிசோதனை அறிக்கை', reportLabel: 'படம் அல்லது PDF தேர்ந்தெடுக்கவும்',
    reportDropTitle: 'மண் அறிக்கையை இங்கே விடுங்கள்', reportDropText: 'அல்லது சாதனத்திலிருந்து படம் அல்லது PDF தேர்ந்தெடுக்கவும்',
    reportNoFile: 'அறிக்கை தேர்ந்தெடுக்கப்படவில்லை', reportUploadHint: 'JPG, PNG அல்லது PDF · 15 MB வரை',
    ocrButton: 'N, P, K மற்றும் pH படிக்கவும்',
    ocrNote: 'ஆங்கிலப் பெயருள்ள அறிக்கைகள் மட்டும். அறிக்கை இந்த உலாவியிலேயே செயலாக்கப்படும்; பதிவேற்றப்படாது. மதிப்புகளையும் அலகுகளையும் சரிபார்க்கவும்.',
    ocrReview: 'என் அறிக்கையுடன் எடுத்த மண் மதிப்புகளையும் அலகுகளையும் சரிபார்த்தேன்.',
    voiceTitle: 'குரல் உள்ளீடு', voiceButton: 'வயல் மதிப்புகளைப் பேசுங்கள்',
    voicePrompt: 'பெயருடன் மதிப்புகளைச் சொல்லுங்கள். உதா: நைட்ரஜன் 90, பாஸ்பரஸ் 42, pH 6.5.',
    voiceNote: 'குரல் அங்கீகார வசதியும் தனியுரிமையும் உங்கள் உலாவியைப் பொறுத்தது.',
    authEyebrow: 'உங்கள் பண்ணை, உங்கள் FIELDWISE கணக்கு', loginTitle: 'மீண்டும் வருக',
    authStoryEyebrow: 'தெளிவான திட்டமிடலுடன் வளருங்கள்',
    authStoryTitle: 'உங்கள் வயலுக்கு ஒரு கதை உண்டு. அடுத்த பருவத்தைச் சிறப்பாக்குங்கள்.',
    authStoryText: 'மண் விவரங்களையும் உள்ளூர் வானிலையையும் இணைத்து பயிர் வாய்ப்புகளை ஆராயுங்கள்.',
    authStoryTagOne: 'மண் சார்ந்தது', authStoryTagTwo: 'வானிலைத் தகவல்', authStoryTagThree: 'விவசாயிக்கு முன்னுரிமை',
    authStoryFoot: 'உங்கள் வயலை அடிப்படையாகக் கொண்ட சிந்தனையுள்ள முடிவுகள்.',
    authIntro: 'உங்கள் பண்ணைக்கான பயிர் பரிந்துரைகளைப் பெற உள்நுழையுங்கள்.',
    registerIntro: 'உங்கள் விவசாயி விவரத்திற்காக Fieldwise கணக்கை உருவாக்குங்கள்.',
    loginTab: 'உள்நுழை', registerTab: 'கணக்கை உருவாக்கு', nameLabel: 'உங்கள் பெயர்',
    emailLabel: 'மின்னஞ்சல் முகவரி', passwordLabel: 'கடவுச்சொல்',
    passwordHint: 'குறைந்தது 8 எழுத்துகள் பயன்படுத்தவும்.', loginButton: 'உள்நுழை',
    registerButton: 'கணக்கை உருவாக்கு',
    authPrivacy: 'உங்கள் கணக்கு இந்தச் செயலியில் சேமிக்கப்படும். கடவுச்சொல் சாதாரண உரையாகச் சேமிக்கப்படாது.',
    logoutButton: 'வெளியேறு', signInExpired: 'உங்கள் அமர்வு முடிந்தது. மீண்டும் உள்நுழையவும்.',
    accountCreated: 'கணக்கு உருவாக்கப்பட்டது. நீங்கள் உள்நுழைந்துவிட்டீர்கள்.',
    signedIn: 'வெற்றிகரமாக உள்நுழைந்தீர்கள்.', signedOut: 'நீங்கள் வெளியேறிவிட்டீர்கள்.',
    homeGreeting: (name) => `உங்கள் வயலுக்கு வரவேற்கிறோம், ${name}.`,
    homeTopbarEyebrow: 'FIELDWISE · பண்ணை நிலவரம்',
    homeTopbarTitle: 'உங்கள் வயல், உங்கள் அடுத்த பருவம்.',
    homeEyebrow: 'FIELDWISE · உங்கள் வேளாண் துணை',
    homeTitle: 'சிறந்த பயிரிடல் முடிவுகள் உங்கள் வயலில் தொடங்குகின்றன.',
    homeText: 'உங்கள் மண் மற்றும் வளரும் சூழலை இணைத்து, வயலுக்கேற்ற பயிர் வாய்ப்புகளை ஆராயுங்கள்.',
    homePrimaryAction: 'பரிந்துரையைத் தொடங்குங்கள்', homeSecondaryAction: 'மண் விவரங்களைச் சேர்க்கவும்',
    homeTrustNote: 'தெளிவான தொடக்கம்—பரிந்துரைகளை உள்ளூர் நிபுணருடன் சரிபார்க்கவும்.',
    homeArtTitle: 'உங்கள் வயலை அடிப்படையாகக் கொண்டது', homeArtText: 'மண் · காலநிலை · பயிர் பொருத்தம்',
    homeMetricCrops: 'தரவுத்தொகுப்பில் பயிர்கள்', homeMetricInputs: 'வயல் குறியீடுகள்',
    homeMetricMatches: 'வரிசைப்படுத்திய பயிர்கள்',
    homeStepsEyebrow: 'தொடங்குவதற்கான எளிய வழி',
    homeStepsTitle: 'வயல் விவரங்களிலிருந்து தெளிவான தேர்வுகள் வரை.',
    homeExploreLink: 'பரிந்துரைகளைப் பாருங்கள்',
    homeStepOneTitle: 'வயல் விவரங்களைச் சேர்க்கவும்',
    homeStepOneText: 'மண் மதிப்புகளை உள்ளிடுங்கள் அல்லது அறிக்கையைப் பயன்படுத்தி எண்களைச் சரிபார்க்கவும்.',
    homeStepTwoTitle: 'உள்ளூர் சூழலைச் சேர்க்கவும்',
    homeStepTwoText: 'வானிலை நிரப்புதலைத் தொடக்கமாகப் பயன்படுத்தி முன்னறிவிப்பைச் சரிபார்க்கவும்.',
    homeStepThreeTitle: 'பயிர் பொருத்தங்களை ஒப்பிடுங்கள்',
    homeStepThreeText: 'மூன்று வரிசைப்படுத்திய தேர்வுகளையும் சிறந்த பொருத்தத்திற்கான காரணங்களையும் பாருங்கள்.',
    nitrogen: 'நைட்ரஜன்', phosphorus: 'பாஸ்பரஸ்', potassium: 'பொட்டாசியம்',
    temperature: 'வெப்பநிலை', humidity: 'ஈரப்பதம்', soilPh: 'மண் pH',
    rainfall: 'எதிர்பார்க்கப்படும் மழையளவு', recommendButton: 'பயிர் பரிந்துரையைப் பெறுங்கள்',
    privacyNote: 'மண் அறிக்கை இந்த உலாவியிலேயே இருக்கும்; வானிலை கோரிக்கைகள் Open-Meteo-க்கு அனுப்பப்படும்.',
    stepResult: 'படி 02 / முடிவு', resultTitle: 'சிறந்த பொருத்தம்', recommendedCrop: 'பரிந்துரைக்கப்படும் பயிர்',
    modelBadge: 'சுயவிவரப் பொருத்தம்', growingPeriod: 'வளர்ச்சிக் காலம்', waterNeed: 'நீர் தேவை', waterHigh: 'அதிகம்',
    resultPlaceholder: 'பொருத்தமான பயிர்களைக் காண வயல் விவரங்களைச் சமர்ப்பிக்கவும்.',
    profileSimilarity: 'சுயவிவரப் பொருத்தம் (நிகழ்தகவு அல்ல)', otherMatches: 'மற்ற சிறந்த பொருத்தங்கள்',
    whyCrop: 'இந்தப் பயிர் ஏன்?', emptyResult: 'பரிந்துரையைப் பெற வயல் விவரங்களை உள்ளிடுங்கள்.',
    recommendationCaveat: 'இது முன்மாதிரி முடிவு ஆதரவு மட்டுமே. பொருத்த மதிப்புகள் நிகழ்தகவுகள் அல்ல; உள்ளூர் வேளாண் நிபுணருடன் பரிந்துரையையும் நிலைமைகளையும் சரிபார்க்கவும்.',
    trainingRangeWarning: (items) => `இந்தத் தரவின் காணப்பட்ட வரம்புக்கு வெளியே: ${items}. பொருத்தம் நம்பகமற்றதாக இருக்கலாம்; உள்ளீடுகளைச் சரிபார்த்து உள்ளூர் வேளாண் நிபுணரிடம் ஆலோசிக்கவும்.`,
    reviewOcrFirst: 'பயிர் பொருத்தத்தைக் கோருவதற்கு முன் OCR எடுத்த மண் மதிப்புகளையும் அலகுகளையும் உறுதிப்படுத்தவும்.',
    resetButton: 'வயல் விவரங்களை மீட்டமை', footerText: 'வயல் முடிவுகளுக்காக வடிவமைக்கப்பட்டது',
    weatherSearching: 'இடத்தையும் வானிலையையும் தேடுகிறது…',
    weatherSuccess: (place, temp, humidity, rainfall) => `${place}: ${temp}°C, ஈரப்பதம் ${humidity}%, அடுத்த 16 நாள் மழை ${rainfall} மி.மீ. மழை கால அளவைச் சரிபார்க்கவும்.`,
    weatherFailure: 'வானிலையைப் பெற முடியவில்லை. இடப்பெயரையும் இணைய இணைப்பையும் சரிபார்க்கவும்.',
    locationUnavailable: 'இந்த உலாவியில் இருப்பிட வசதி இல்லை.',
    locationDenied: 'இருப்பிட அனுமதி மறுக்கப்பட்டது. ஊர் அல்லது கிராமத்தை உள்ளிடுங்கள்.',
    weatherForecast: 'முன்னறிவிப்பு', ocrMissingFile: 'முதலில் படம் அல்லது PDF அறிக்கையைத் தேர்ந்தெடுக்கவும்.',
    ocrUnsupported: 'OCR கருவிகளை ஏற்ற முடியவில்லை. இணைய இணைப்பைச் சரிபார்த்து மீண்டும் முயற்சிக்கவும்.',
    ocrWorking: 'அறிக்கை உலாவியில் படிக்கப்படுகிறது…', ocrNoValues: 'N, P, K அல்லது pH கிடைக்கவில்லை. மதிப்புகளை கைமுறையாக உள்ளிடுங்கள்.',
    ocrSuccess: (count, missing) => `${count} மதிப்பு(கள்) நிரப்பப்பட்டன.${missing ? ` கிடைக்கவில்லை: ${missing}.` : ''} மதிப்புகளையும் அலகுகளையும் சரிபார்க்கவும்.`,
    ocrInvalid: (name) => `கண்டறிந்த ${name} மதிப்பு அனுமதிக்கப்பட்ட வரம்பிற்கு வெளியே உள்ளது; நிரப்பப்படவில்லை.`,
    ocrFailed: (message) => `அறிக்கையைப் படிக்க முடியவில்லை: ${message}`,
    voiceUnsupported: 'இந்த உலாவியில் குரல் உள்ளீடு இல்லை. மதிப்புகளைத் தட்டச்சு செய்யலாம்.',
    voiceListening: 'கேட்கிறது… வயல் பெயரைத் தொடர்ந்து மதிப்பைச் சொல்லுங்கள்.',
    voiceNoValues: 'பெயருடன் எண்கள் அடையாளம் காணப்படவில்லை. “நைட்ரஜன் 90, பாஸ்பரஸ் 42, pH 6.5” என்று முயற்சிக்கவும்.',
    voiceSuccess: (count) => `குரல் மூலம் ${count} மதிப்பு(கள்) நிரப்பப்பட்டன. தொடர்வதற்கு முன் சரிபார்க்கவும்.`,
    voiceFailed: 'குரல் உள்ளீடு தோல்வியடைந்தது. மைக்ரோஃபோன் அனுமதியைச் சரிபார்த்து மீண்டும் முயற்சிக்கவும்.',
    analysing: 'வயலைப் பகுப்பாய்வு செய்கிறது…', requestFailed: 'பரிந்துரையைப் பெற முடியவில்லை.',
    recommendationFailed: 'பரிந்துரையை உருவாக்க முடியவில்லை.',
    whyTemplate: (feature, value, unit, crop) => `${feature} ${value}${unit ? ` ${unit}` : ''}, ${crop} பயிரின் வழக்கமான விவரத்துடன் பொருந்துகிறது.`,
    recommendationMessage: (crop) => `உங்கள் வயல் விவரங்கள் ${crop} பயிருடன் நன்றாகப் பொருந்துகின்றன.`,
  },
  hi: {
    season: 'खरीफ का मौसम', navHome: 'होम', navRecommendation: 'सिफ़ारिश', navSoil: 'मिट्टी की जानकारी',
    navHistory: 'पिछले परिणाम', needHelp: 'मदद चाहिए?', talkExpert: 'कृषि विशेषज्ञ से बात करें',
    language: 'भाषा', eyebrow: 'खेत निर्णय सहायता', pageTitle: 'अब कौन-सी फसल लगाएँ?',
    welcomeEyebrow: 'मिट्टी से मौसम तक एक साफ़ रास्ता', welcomeTitle: 'अगली फसल का सही चुनाव करें।',
    welcomeText: 'अपने खेत की जानकारी भरें; Fieldwise आपकी ज़मीन के लिए उपयुक्त फसल सुझाएगा।',
    weatherSummary: 'मौसम भरने के बाद यहाँ दिखेगा', stepInputs: 'चरण 01 / खेत की जानकारी',
    inputsTitle: 'अपने खेत के बारे में बताएँ', required: 'सभी जानकारी ज़रूरी है',
    weatherTitle: 'मौसम अपने-आप भरें', locationLabel: 'शहर या गाँव', locationPlaceholder: 'जैसे कोयंबटूर',
    weatherButton: 'मौसम भरें', locationButton: 'मेरी जगह इस्तेमाल करें',
    rainfallNote: 'बारिश Open-Meteo का अगले 16 दिनों का कुल पूर्वानुमान है। उपयोग से पहले जाँचें; मॉडल के डेटा में अलग अवधि हो सकती है।',
    reportTitle: 'मिट्टी जाँच रिपोर्ट', reportLabel: 'फ़ोटो या PDF चुनें', ocrButton: 'N, P, K और pH पढ़ें',
    reportDropTitle: 'मिट्टी की रिपोर्ट यहाँ छोड़ें', reportDropText: 'या अपने डिवाइस से फ़ोटो या PDF चुनें',
    reportNoFile: 'कोई रिपोर्ट नहीं चुनी गई', reportUploadHint: 'JPG, PNG या PDF · 15 MB तक',
    ocrNote: 'केवल अंग्रेज़ी नाम वाली रिपोर्टें। रिपोर्ट इसी ब्राउज़र में पढ़ी जाती है, अपलोड नहीं होती। मान और इकाइयाँ जाँचें।',
    ocrReview: 'मैंने रिपोर्ट से निकले मिट्टी के मान और इकाइयाँ जाँच ली हैं।',
    voiceTitle: 'आवाज़ से भरें', voiceButton: 'खेत की जानकारी बोलें',
    voicePrompt: 'नाम के साथ मान बोलें, जैसे: नाइट्रोजन 90, फॉस्फोरस 42, pH 6.5।',
    voiceNote: 'आवाज़ पहचान की सुविधा और गोपनीयता आपके ब्राउज़र पर निर्भर करती है।',
    authEyebrow: 'आपका खेत, आपका FIELDWISE खाता', loginTitle: 'वापस स्वागत है',
    authStoryEyebrow: 'बेहतर समझ के साथ आगे बढ़ें',
    authStoryTitle: 'आपके खेत की अपनी कहानी है। अगला मौसम बेहतर बनाइए।',
    authStoryText: 'मिट्टी की जानकारी और स्थानीय मौसम को साथ देखकर फसल विकल्प समझें।',
    authStoryTagOne: 'मिट्टी पर आधारित', authStoryTagTwo: 'मौसम की जानकारी', authStoryTagThree: 'किसान पहले',
    authStoryFoot: 'आपके खेत पर आधारित सोच-समझकर लिए गए फैसले।',
    authIntro: 'अपने खेत के लिए फसल की सिफ़ारिश पाने के लिए साइन इन करें।',
    registerIntro: 'अपनी किसान प्रोफ़ाइल के लिए Fieldwise खाता बनाएँ।',
    loginTab: 'साइन इन', registerTab: 'खाता बनाएँ', nameLabel: 'आपका नाम',
    emailLabel: 'ईमेल पता', passwordLabel: 'पासवर्ड',
    passwordHint: 'कम-से-कम 8 अक्षर रखें।', loginButton: 'साइन इन',
    registerButton: 'खाता बनाएँ',
    authPrivacy: 'आपका खाता इस ऐप में सेव होता है। पासवर्ड सादे टेक्स्ट में सेव नहीं किया जाता।',
    logoutButton: 'साइन आउट', signInExpired: 'आपका सत्र समाप्त हो गया। कृपया फिर साइन इन करें।',
    accountCreated: 'खाता बन गया। आप साइन इन हो गए हैं।',
    signedIn: 'साइन इन सफल हुआ।', signedOut: 'आप साइन आउट हो गए हैं।',
    homeGreeting: (name) => `आपके खेत में स्वागत है, ${name}।`,
    homeTopbarEyebrow: 'FIELDWISE · खेत का सार',
    homeTopbarTitle: 'आपका खेत, आपका अगला मौसम।',
    homeEyebrow: 'FIELDWISE · आपका खेती साथी',
    homeTitle: 'बेहतर बुवाई के फैसले आपके खेत से शुरू होते हैं।',
    homeText: 'मिट्टी और खेती की परिस्थितियों को साथ देखकर अपने खेत के लिए फसल विकल्प जानें।',
    homePrimaryAction: 'सिफ़ारिश शुरू करें', homeSecondaryAction: 'मिट्टी की जानकारी जोड़ें',
    homeTrustNote: 'एक स्पष्ट शुरुआत—सुझावों को स्थानीय विशेषज्ञ से ज़रूर जाँचें।',
    homeArtTitle: 'आपके खेत पर आधारित', homeArtText: 'मिट्टी · जलवायु · फसल मेल',
    homeMetricCrops: 'डेटासेट में फसलें', homeMetricInputs: 'खेत के संकेतक',
    homeMetricMatches: 'क्रम में फसल सुझाव',
    homeStepsEyebrow: 'शुरू करने का आसान तरीका',
    homeStepsTitle: 'खेत की जानकारी से बेहतर विकल्पों तक।',
    homeExploreLink: 'सिफ़ारिशें देखें',
    homeStepOneTitle: 'खेत की जानकारी जोड़ें',
    homeStepOneText: 'मिट्टी के मान भरें या रिपोर्ट से पढ़े गए हर मान की जाँच करें।',
    homeStepTwoTitle: 'स्थानीय परिस्थितियाँ जोड़ें',
    homeStepTwoText: 'मौसम ऑटोफिल को शुरुआती जानकारी मानें और पूर्वानुमान जाँचें।',
    homeStepThreeTitle: 'फसल सुझावों की तुलना करें',
    homeStepThreeText: 'तीन क्रमबद्ध विकल्प और सबसे अच्छे मेल के कारण देखें।',
    nitrogen: 'नाइट्रोजन', phosphorus: 'फॉस्फोरस', potassium: 'पोटैशियम',
    temperature: 'तापमान', humidity: 'नमी', soilPh: 'मिट्टी का pH',
    rainfall: 'अपेक्षित बारिश', recommendButton: 'फसल की सिफ़ारिश पाएँ',
    privacyNote: 'मिट्टी की रिपोर्ट इसी ब्राउज़र में रहती है; मौसम के अनुरोध Open-Meteo को भेजे जाते हैं।',
    stepResult: 'चरण 02 / परिणाम', resultTitle: 'सबसे अच्छा मेल', recommendedCrop: 'सुझाई गई फसल',
    modelBadge: 'जानकारी का मेल', growingPeriod: 'बढ़ने की अवधि', waterNeed: 'पानी की ज़रूरत', waterHigh: 'ज़्यादा',
    resultPlaceholder: 'उपयुक्त फसलें देखने के लिए खेत की जानकारी भेजें।',
    profileSimilarity: 'जानकारी का मेल (संभाव्यता नहीं)', otherMatches: 'अन्य अच्छे विकल्प',
    whyCrop: 'यह फसल क्यों?', emptyResult: 'सिफ़ारिश पाने के लिए खेत की जानकारी भरें।',
    recommendationCaveat: 'यह केवल एक प्रोटोटाइप निर्णय-सहायक है। मेल के अंक संभाव्यता नहीं हैं; सुझाव और स्थानीय परिस्थितियाँ कृषि विशेषज्ञ से जाँचें।',
    trainingRangeWarning: (items) => `ये मान इस डेटा में देखी गई सीमा से बाहर हैं: ${items}। मिलान भरोसेमंद न हो सकता है; इनपुट जाँचें और स्थानीय कृषि विशेषज्ञ से सलाह लें।`,
    reviewOcrFirst: 'फसल का मिलान माँगने से पहले OCR से निकले मिट्टी के मान और इकाइयों की पुष्टि करें।',
    resetButton: 'खेत की जानकारी मिटाएँ', footerText: 'खेत में काम के फ़ैसलों के लिए बनाया गया',
    weatherSearching: 'जगह और मौसम खोज रहे हैं…',
    weatherSuccess: (place, temp, humidity, rainfall) => `${place}: ${temp}°C, नमी ${humidity}%, अगले 16 दिनों की बारिश ${rainfall} मिमी। बारिश की अवधि जाँचें।`,
    weatherFailure: 'मौसम नहीं मिल सका। जगह का नाम और इंटरनेट कनेक्शन जाँचें।',
    locationUnavailable: 'इस ब्राउज़र में जगह की सुविधा उपलब्ध नहीं है।',
    locationDenied: 'जगह की अनुमति नहीं मिली। शहर या गाँव का नाम भरें।',
    weatherForecast: 'पूर्वानुमान', ocrMissingFile: 'पहले फ़ोटो या PDF रिपोर्ट चुनें।',
    ocrUnsupported: 'OCR टूल लोड नहीं हुए। इंटरनेट जाँचकर फिर कोशिश करें।',
    ocrWorking: 'रिपोर्ट इसी ब्राउज़र में पढ़ी जा रही है…', ocrNoValues: 'N, P, K या pH नहीं मिला। मान खुद भरें।',
    ocrSuccess: (count, missing) => `${count} मान भरे गए।${missing ? ` नहीं मिले: ${missing}.` : ''} मान और इकाइयाँ जाँचें।`,
    ocrInvalid: (name) => `मिला हुआ ${name} मान स्वीकार्य सीमा से बाहर है; इसे नहीं भरा गया।`,
    ocrFailed: (message) => `रिपोर्ट नहीं पढ़ सके: ${message}`,
    voiceUnsupported: 'इस ब्राउज़र में आवाज़ से भरने की सुविधा नहीं है। आप मान टाइप कर सकते हैं।',
    voiceListening: 'सुन रहे हैं… नाम के बाद मान बोलें।',
    voiceNoValues: 'नाम के साथ कोई संख्या नहीं मिली। “नाइट्रोजन 90, फॉस्फोरस 42, pH 6.5” बोलकर देखें।',
    voiceSuccess: (count) => `आवाज़ से ${count} मान भरे गए। आगे बढ़ने से पहले जाँचें।`,
    voiceFailed: 'आवाज़ से जानकारी नहीं भर सकी। माइक्रोफ़ोन अनुमति जाँचें और फिर कोशिश करें।',
    analysing: 'खेत का विश्लेषण हो रहा है…', requestFailed: 'सिफ़ारिश नहीं मिल सकी.',
    recommendationFailed: 'सिफ़ारिश तैयार नहीं हो सकी।',
    whyTemplate: (feature, value, unit, crop) => `${feature} ${value}${unit ? ` ${unit}` : ''}, ${crop} की सामान्य जानकारी से मेल खाता है।`,
    recommendationMessage: (crop) => `आपके खेत की जानकारी ${crop} के लिए अच्छी तरह मेल खाती है।`,
  },
};

const featureLabels = {
  nitrogen: { en: 'Nitrogen', ta: 'நைட்ரஜன்', hi: 'नाइट्रोजन', unit: 'kg/ha' },
  phosphorus: { en: 'Phosphorus', ta: 'பாஸ்பரஸ்', hi: 'फॉस्फोरस', unit: 'kg/ha' },
  potassium: { en: 'Potassium', ta: 'பொட்டாசியம்', hi: 'पोटैशियम', unit: 'kg/ha' },
  temperature: { en: 'Temperature', ta: 'வெப்பநிலை', hi: 'तापमान', unit: '°C' },
  humidity: { en: 'Humidity', ta: 'ஈரப்பதம்', hi: 'नमी', unit: '%' },
  ph: { en: 'Soil pH', ta: 'மண் pH', hi: 'मिट्टी का pH', unit: '' },
  rainfall: { en: 'Rainfall', ta: 'மழையளவு', hi: 'बारिश', unit: 'mm' },
};

let language = 'en';
let ocrValuesNeedReview = false;
let activeRecognition = null;
let authMode = 'login';
let currentUserName = '';
const speechAliases = {
  nitrogen: /(?:nitrogen|नाइट्रोजन|நைட்ரஜன்|\bn\b)\s*(?:is\s*)?([0-9०-९௦-௯]+(?:[.,][0-9०-९௦-௯]+)?)/iu,
  phosphorus: /(?:phosphorus|phosphorous|फॉस्फोरस|फास्फोरस|பாஸ்பரஸ்|\bp\b)\s*(?:is\s*)?([0-9०-९௦-௯]+(?:[.,][0-9०-९௦-௯]+)?)/iu,
  potassium: /(?:potassium|पोटैशियम|पोटाश|பொட்டாசியம்|\bk\b)\s*(?:is\s*)?([0-9०-९௦-௯]+(?:[.,][0-9०-९௦-௯]+)?)/iu,
  ph: /(?:soil\s*)?(?:p\s*h|पीएच|பிஹெச்)\s*(?:is\s*)?([0-9०-९௦-௯]+(?:[.,][0-9०-९௦-௯]+)?)/iu,
  temperature: /(?:temperature|तापमान|வெப்பநிலை)\s*(?:is\s*)?([0-9०-९௦-௯]+(?:[.,][0-9०-९௦-௯]+)?)/iu,
  humidity: /(?:humidity|आर्द्रता|नमी|ஈரப்பதம்)\s*(?:is\s*)?([0-9०-९௦-௯]+(?:[.,][0-9०-९௦-௯]+)?)/iu,
  rainfall: /(?:rainfall|बारिश|वर्षा|மழை)\s*(?:is\s*)?([0-9०-९௦-௯]+(?:[.,][0-9०-९௦-௯]+)?)/iu,
};

function t(key, ...args) {
  const value = translations[language][key] ?? translations.en[key];
  return typeof value === 'function' ? value(...args) : value;
}

function setLanguage(nextLanguage) {
  language = translations[nextLanguage] ? nextLanguage : 'en';
  document.documentElement.lang = language;
  document.querySelectorAll('[data-i18n]').forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });
  locationInput.placeholder = t('locationPlaceholder');
  languageSelect.value = language;
  authLanguageSelect.value = language;
  updateHomeGreeting();
  updateReportFileName();
  updateAppRoute();
  try {
    localStorage.setItem('fieldwise-language', language);
  } catch {
    // Language selection still works when browser storage is unavailable.
  }
  setAuthMode(authMode);
  if (activeRecognition) activeRecognition.lang = `${language}-IN`;
}

function setLoading(isLoading) {
  submitButton.disabled = isLoading;
  submitButton.classList.toggle('is-loading', isLoading);
  const label = submitButton.querySelector('[data-i18n="recommendButton"]');
  if (label) label.textContent = isLoading ? t('analysing') : t('recommendButton');
}

function setAuthMode(mode) {
  authMode = mode;
  const isRegister = mode === 'register';
  nameField.hidden = !isRegister;
  authName.required = isRegister;
  authPassword.autocomplete = isRegister ? 'new-password' : 'current-password';
  authTitle.textContent = t(isRegister ? 'registerTab' : 'loginTitle');
  authIntro.textContent = t(isRegister ? 'registerIntro' : 'authIntro');
  authSubmit.textContent = t(isRegister ? 'registerButton' : 'loginButton');
  loginModeButton.classList.toggle('active', !isRegister);
  registerModeButton.classList.toggle('active', isRegister);
  loginModeButton.setAttribute('aria-pressed', String(!isRegister));
  registerModeButton.setAttribute('aria-pressed', String(isRegister));
  authStatus.textContent = '';
}

function updateHomeGreeting() {
  const firstName = currentUserName.trim().split(/\s+/)[0] || 'Farmer';
  document.querySelector('#home-greeting').textContent = t('homeGreeting', firstName);
}

function updateAppRoute(scrollToTarget = false) {
  const hash = location.hash || '#home';
  const recommendationRoute = ['#recommend', '#soil', '#history'].includes(hash);
  appShell.dataset.view = recommendationRoute ? 'recommendation' : 'home';
  const eyebrow = document.querySelector('.topbar .eyebrow');
  const title = document.querySelector('.topbar h1');
  eyebrow.textContent = recommendationRoute ? t('eyebrow') : t('homeTopbarEyebrow');
  title.textContent = recommendationRoute ? t('pageTitle') : t('homeTopbarTitle');
  document.querySelectorAll('.nav-item').forEach((item) => {
    item.classList.toggle('active', item.getAttribute('href') === hash);
  });
  if (!scrollToTarget) return;
  requestAnimationFrame(() => {
    document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

function formatFileSize(size) {
  return size < 1024 * 1024
    ? `${Math.max(1, Math.round(size / 1024))} KB`
    : `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function updateReportFileName() {
  const file = reportFile.files[0];
  reportFileName.textContent = file ? `${file.name} · ${formatFileSize(file.size)}` : t('reportNoFile');
  reportDropzone.classList.toggle('has-file', Boolean(file));
}

function showAuthenticatedApp(user, statusMessage = '') {
  authScreen.hidden = true;
  appShell.hidden = false;
  currentUserName = user.name;
  document.querySelector('#profile-name').textContent = user.name;
  document.querySelector('#profile-email').textContent = user.email;
  document.querySelector('#profile-avatar').textContent = user.name.trim().charAt(0).toUpperCase();
  updateHomeGreeting();
  updateAppRoute();
  authStatus.textContent = statusMessage;
}

function showAuthScreen(message = '') {
  appShell.hidden = true;
  authScreen.hidden = false;
  authStatus.textContent = message;
}

async function submitAuth(endpoint, values) {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(values),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || t('signedIn'));
  showAuthenticatedApp(result.user, endpoint === '/auth/register' ? t('accountCreated') : t('signedIn'));
}

async function initializeAuthentication() {
  try {
    const meResponse = await fetch('/auth/me', { cache: 'no-store' });
    if (!meResponse.ok) throw new Error('Could not load sign-in settings.');
    const session = await meResponse.json();
    if (session.authenticated && session.user) {
      showAuthenticatedApp(session.user);
    } else {
      showAuthScreen();
    }
  } catch (error) {
    showAuthScreen(error.message);
  }
}

async function requestRecommendation(values) {
  const response = await fetch('/predict', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(values),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    if (response.status === 401) {
      showAuthScreen(t('signInExpired'));
    }
    throw new Error(errorData.error || t('requestFailed'));
  }

  return response.json();
}

loginModeButton.addEventListener('click', () => setAuthMode('login'));
registerModeButton.addEventListener('click', () => setAuthMode('register'));
authForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const endpoint = authMode === 'register' ? '/auth/register' : '/auth/login';
  const values = {
    email: document.querySelector('#auth-email').value,
    password: authPassword.value,
  };
  if (authMode === 'register') values.name = authName.value;
  authSubmit.disabled = true;
  authStatus.textContent = '';
  try {
    await submitAuth(endpoint, values);
  } catch (error) {
    authStatus.textContent = error.message;
  } finally {
    authSubmit.disabled = false;
  }
});
logoutButton.addEventListener('click', async () => {
  logoutButton.disabled = true;
  try {
    const response = await fetch('/auth/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{}',
    });
    if (!response.ok) throw new Error('Could not sign out. Please try again.');
    authForm.reset();
    setAuthMode('login');
    showAuthScreen(t('signedOut'));
  } catch (error) {
    authStatus.textContent = error.message;
  } finally {
    logoutButton.disabled = false;
  }
});

window.addEventListener('hashchange', () => updateAppRoute(true));

function renderReasons(result, values) {
  const reasons = result.reasons.map((reason) => {
    const feature = Object.keys(featureLabels).find((key) => reason.startsWith(featureLabels[key].en));
    if (!feature) return reason;
    const label = featureLabels[feature];
    return t('whyTemplate', label[language], values[feature], label.unit, result.crop);
  });
  reasonList.replaceChildren(...reasons.map((reason) => {
    const item = document.createElement('li');
    item.textContent = reason;
    return item;
  }));
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (ocrValuesNeedReview && !ocrReview.checked) {
    ocrStatus.textContent = t('reviewOcrFirst');
    ocrReview.focus();
    return;
  }
  const data = new FormData(form);
  const values = Object.fromEntries(data.entries());
  Object.keys(values).forEach((key) => { values[key] = Number(values[key]); });

  trainingWarning.textContent = '';
  trainingWarning.hidden = true;
  setLoading(true);
  try {
    const result = await requestRecommendation(values);
    cropName.textContent = result.crop;
    const topScore = result.recommendations[0].match_score;
    confidenceValue.textContent = `${topScore}%`;
    confidenceBar.style.width = `${topScore}%`;
    alternatives.hidden = false;
    recommendationList.replaceChildren(...result.recommendations.slice(1).map((item, index) => {
      const row = document.createElement('li');
      const crop = document.createElement('span');
      const rank = document.createElement('b');
      const score = document.createElement('strong');
      rank.textContent = `#${index + 2}`;
      crop.append(rank, document.createTextNode(` ${item.crop}`));
      score.textContent = `${item.match_score}%`;
      row.append(crop, score);
      return row;
    }));
    renderReasons(result, values);
    whyCrop.hidden = false;
    const warnings = result.out_of_training_range || [];
    if (warnings.length) {
      const items = warnings.map((item) => {
        const featureKey = {
          Nitrogen: 'nitrogen',
          Phosphorus: 'phosphorus',
          Potassium: 'potassium',
          Temperature: 'temperature',
          Humidity: 'humidity',
          pH_Value: 'ph',
          Rainfall: 'rainfall',
        }[item.feature];
        const feature = featureLabels[featureKey];
        const label = feature ? feature[language] : item.feature;
        const unit = feature?.unit ? ` ${feature.unit}` : '';
        return `${label}: ${item.value}${unit} (dataset ${item.minimum}–${item.maximum}${unit})`;
      }).join('; ');
      trainingWarning.textContent = t('trainingRangeWarning', items);
      trainingWarning.hidden = false;
    } else {
      trainingWarning.textContent = '';
      trainingWarning.hidden = true;
    }
    document.querySelector('.result-copy').textContent = t('recommendationMessage', result.crop);
    resultPanel.classList.add('is-ready');
  } catch (error) {
    document.querySelector('.result-copy').textContent = error.message || t('recommendationFailed');
    confidenceValue.textContent = '0%';
    confidenceBar.style.width = '0%';
  } finally {
    setLoading(false);
  }
});

async function getWeather(latitude, longitude, place) {
  weatherStatus.textContent = t('weatherSearching');
  weatherButton.disabled = true;
  locationButton.disabled = true;
  try {
    const params = new URLSearchParams({
      latitude: String(latitude),
      longitude: String(longitude),
      current: 'temperature_2m,relative_humidity_2m',
      daily: 'precipitation_sum',
      forecast_days: '16',
      timezone: 'auto',
    });
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
    if (!response.ok) throw new Error(`Weather service returned ${response.status}.`);
    const forecast = await response.json();
    const temperature = forecast.current?.temperature_2m;
    const humidity = forecast.current?.relative_humidity_2m;
    const rainfallValues = forecast.daily?.precipitation_sum;
    if (
      !Number.isFinite(temperature)
      || temperature < -10
      || temperature > 60
      || !Number.isFinite(humidity)
      || humidity < 0
      || humidity > 100
      || !Array.isArray(rainfallValues)
      || rainfallValues.length === 0
      || !rainfallValues.every((value) => Number.isFinite(value) && value >= 0)
    ) {
      throw new Error('Weather response did not include the requested values.');
    }
    const rainfall = rainfallValues.reduce((sum, value) => sum + value, 0);
    if (rainfall > 1000) throw new Error('Forecast rainfall is outside the accepted range.');
    form.elements.temperature.value = temperature.toFixed(1);
    form.elements.humidity.value = humidity.toFixed(1);
    form.elements.rainfall.value = rainfall.toFixed(1);
    document.querySelector('#weather-summary').textContent = `${temperature.toFixed(1)}°C`;
    weatherStatus.textContent = t('weatherSuccess', place, temperature.toFixed(1), humidity.toFixed(0), rainfall.toFixed(1));
  } catch (error) {
    weatherStatus.textContent = `${t('weatherFailure')} ${error.message}`;
  } finally {
    weatherButton.disabled = false;
    locationButton.disabled = false;
  }
}

async function findWeatherByPlace() {
  const place = locationInput.value.trim();
  if (!place) {
    weatherStatus.textContent = t('weatherFailure');
    locationInput.focus();
    return;
  }
  weatherStatus.textContent = t('weatherSearching');
  weatherButton.disabled = true;
  try {
    const params = new URLSearchParams({
      name: place,
      count: '1',
      language: language === 'hi' ? 'hi' : 'en',
      format: 'json',
    });
    const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?${params}`);
    if (!response.ok) throw new Error(`Location service returned ${response.status}.`);
    const result = await response.json();
    if (!result.results?.length) throw new Error('No matching town or village was found.');
    const found = result.results[0];
    locationInput.value = [found.name, found.admin1, found.country].filter(Boolean).join(', ');
    await getWeather(found.latitude, found.longitude, found.name);
  } catch (error) {
    weatherStatus.textContent = `${t('weatherFailure')} ${error.message}`;
    weatherButton.disabled = false;
  }
}

weatherButton.addEventListener('click', findWeatherByPlace);
locationInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    findWeatherByPlace();
  }
});
locationButton.addEventListener('click', () => {
  if (!navigator.geolocation) {
    weatherStatus.textContent = t('locationUnavailable');
    return;
  }
  weatherStatus.textContent = t('weatherSearching');
  navigator.geolocation.getCurrentPosition(
    ({ coords }) => {
      locationInput.value = language === 'ta' ? 'என் இருப்பிடம்' : language === 'hi' ? 'मेरा स्थान' : 'My location';
      getWeather(coords.latitude, coords.longitude, t('weatherForecast'));
    },
    (error) => {
      weatherStatus.textContent = error.code === error.PERMISSION_DENIED
        ? t('locationDenied')
        : `${t('weatherFailure')} ${error.message}`;
    },
    { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 },
  );
});

const labAliases = {
  nitrogen: '(?:nitrogen|\\bN\\b|नाइट्रोजन|நைட்ரஜன்)',
  phosphorus: '(?:phosphorus|phosphorous|\\bP\\b|फॉस्फोरस|பாஸ்பரஸ்)',
  potassium: '(?:potassium|\\bK\\b|पोटैशियम|பொட்டாசியம்)',
  ph: '(?:soil\\s*)?(?:p\\s*h|पीएच|பிஹெச்)',
};

function parseLabValues(text) {
  const values = {};
  const digits = '([0-9०-९௦-௯]+(?:[.,][0-9०-९௦-௯]+)?)';
  Object.entries(labAliases).forEach(([field, alias]) => {
    const pattern = new RegExp(`(?:^|[^\\p{L}])${alias}(?:\\s*\\([NnPpKk]\\))?\\s*(?:[:=\\-]\\s*)?${digits}`, 'iu');
    const match = pattern.exec(text);
    if (!match) return;
    const normalized = match[1]
      .replace(/[०-९]/g, (digit) => String(digit.charCodeAt(0) - '०'.charCodeAt(0)))
      .replace(/[௦-௯]/g, (digit) => String(digit.charCodeAt(0) - '௦'.charCodeAt(0)))
      .replace(',', '.');
    values[field] = Number(normalized);
  });
  return values;
}

function isPdf(file) {
  return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
}

async function readPdf(file) {
  if (!window.pdfjsLib) throw new Error(t('ocrUnsupported'));
  window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js';
  const pdf = await window.pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
  if (pdf.numPages > 10) throw new Error('Please use a PDF with 10 pages or fewer.');
  const textPages = [];
  const scanPages = [];
  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const textContent = await page.getTextContent();
    textPages.push(textContent.items.map((item) => item.str).join(' '));
    if (pageNumber <= 3) scanPages.push(page);
  }

  let text = textPages.join('\n');
  if (Object.keys(parseLabValues(text)).length < 4) {
    const worker = await window.Tesseract.createWorker('eng', 1, {
      logger: (message) => {
        if (message.status === 'recognizing text') {
          ocrStatus.textContent = `${t('ocrWorking')} ${Math.round(message.progress * 100)}%`;
        }
      },
    });
    try {
      for (const page of scanPages) {
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement('canvas');
        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);
        await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
        const result = await worker.recognize(canvas);
        text += `\n${result.data.text}`;
      }
    } finally {
      await worker.terminate();
    }
  }
  return text;
}

async function readImage(file) {
  if (!window.Tesseract) throw new Error(t('ocrUnsupported'));
  const result = await window.Tesseract.recognize(file, 'eng', {
    logger: (message) => {
      if (message.status === 'recognizing text') {
        ocrStatus.textContent = `${t('ocrWorking')} ${Math.round(message.progress * 100)}%`;
      }
    },
  });
  return result.data.text;
}

ocrButton.addEventListener('click', async () => {
  const file = reportFile.files[0];
  if (!file) {
    ocrStatus.textContent = t('ocrMissingFile');
    return;
  }
  if (file.size > 15 * 1024 * 1024) {
    ocrStatus.textContent = 'Please choose a report smaller than 15 MB.';
    return;
  }
  if (!isPdf(file) && !file.type.startsWith('image/')) {
    ocrStatus.textContent = t('ocrFailed', 'Unsupported file type.');
    return;
  }
  ocrButton.disabled = true;
  ocrButton.classList.add('is-processing');
  ocrValuesNeedReview = false;
  ocrReview.checked = false;
  ocrReviewRow.hidden = true;
  ocrStatus.textContent = t('ocrWorking');
  try {
    const text = isPdf(file) ? await readPdf(file) : await readImage(file);
    const values = parseLabValues(text);
    const names = Object.keys(labAliases);
    if (!Object.keys(values).length) {
      ocrStatus.textContent = t('ocrNoValues');
      return;
    }
    const invalidField = Object.entries(values).find(([field, value]) => {
      const input = form.elements[field];
      return value < Number(input.min) || value > Number(input.max);
    });
    if (invalidField) {
      ocrStatus.textContent = t('ocrInvalid', featureLabels[invalidField[0]][language]);
      return;
    }
    Object.entries(values).forEach(([field, value]) => { form.elements[field].value = String(value); });
    ocrValuesNeedReview = true;
    ocrReviewRow.hidden = false;
    const missing = names.filter((field) => values[field] === undefined)
      .map((field) => featureLabels[field][language]).join(', ');
    ocrStatus.textContent = t('ocrSuccess', Object.keys(values).length, missing);
  } catch (error) {
    ocrStatus.textContent = t('ocrFailed', error.message || 'Unknown OCR error.');
  } finally {
    ocrButton.disabled = false;
    ocrButton.classList.remove('is-processing');
  }
});

reportFile.addEventListener('change', () => {
  updateReportFileName();
  ocrStatus.textContent = '';
  ocrReviewRow.hidden = true;
  ocrReview.checked = false;
  ocrValuesNeedReview = false;
});

['dragenter', 'dragover'].forEach((eventName) => {
  reportDropzone.addEventListener(eventName, (event) => {
    event.preventDefault();
    reportDropzone.classList.add('is-dragging');
  });
});

['dragleave', 'drop'].forEach((eventName) => {
  reportDropzone.addEventListener(eventName, (event) => {
    event.preventDefault();
    reportDropzone.classList.remove('is-dragging');
  });
});

reportDropzone.addEventListener('drop', (event) => {
  const file = event.dataTransfer.files[0];
  if (!file) return;
  const transfer = new DataTransfer();
  transfer.items.add(file);
  reportFile.files = transfer.files;
  reportFile.dispatchEvent(new Event('change', { bubbles: true }));
});

ocrReview.addEventListener('change', () => {
  if (ocrReview.checked) ocrStatus.textContent = '';
});

form.addEventListener('input', (event) => {
  if (!ocrValuesNeedReview || event.target === ocrReview) return;
  ocrReview.checked = false;
});

function parseSpeechValues(transcript) {
  const values = {};
  Object.entries(speechAliases).forEach(([field, pattern]) => {
    const match = pattern.exec(transcript);
    if (!match) return;
    const normalized = match[1]
      .replace(/[०-९]/g, (digit) => String(digit.charCodeAt(0) - '०'.charCodeAt(0)))
      .replace(/[௦-௯]/g, (digit) => String(digit.charCodeAt(0) - '௦'.charCodeAt(0)))
      .replace(',', '.');
    values[field] = Number(normalized);
  });
  return values;
}

voiceButton.addEventListener('click', () => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    voiceStatus.textContent = t('voiceUnsupported');
    return;
  }
  if (activeRecognition) activeRecognition.abort();
  const recognition = new SpeechRecognition();
  recognition.lang = language === 'ta' ? 'ta-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  activeRecognition = recognition;
  voiceButton.disabled = true;
  voiceStatus.textContent = t('voiceListening');
  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    const values = parseSpeechValues(transcript);
    let count = 0;
    Object.entries(values).forEach(([field, value]) => {
      const input = form.elements[field];
      if (value < Number(input.min) || value > Number(input.max)) return;
      input.value = String(value);
      count += 1;
    });
    voiceStatus.textContent = count ? t('voiceSuccess', count) : t('voiceNoValues');
  };
  recognition.onerror = () => {
    voiceStatus.textContent = t('voiceFailed');
  };
  recognition.onend = () => {
    activeRecognition = null;
    voiceButton.disabled = false;
  };
  recognition.start();
});

languageSelect.addEventListener('change', () => setLanguage(languageSelect.value));
authLanguageSelect.addEventListener('change', () => setLanguage(authLanguageSelect.value));

resetButton.addEventListener('click', () => {
  form.reset();
  reportFile.value = '';
  updateReportFileName();
  cropName.textContent = '—';
  confidenceValue.textContent = '--';
  confidenceBar.style.width = '0%';
  recommendationList.replaceChildren();
  alternatives.hidden = true;
  reasonList.replaceChildren();
  whyCrop.hidden = true;
  trainingWarning.textContent = '';
  trainingWarning.hidden = true;
  ocrValuesNeedReview = false;
  ocrReview.checked = false;
  ocrReviewRow.hidden = true;
  document.querySelector('.result-copy').textContent = t('resultPlaceholder');
  resultPanel.classList.remove('is-ready');
  weatherStatus.textContent = '';
  ocrStatus.textContent = '';
  voiceStatus.textContent = '';
  document.querySelector('#weather-summary').textContent = '--';
});

let savedLanguage = 'en';
try {
  savedLanguage = localStorage.getItem('fieldwise-language') || 'en';
} catch {
  savedLanguage = 'en';
}
setLanguage(savedLanguage);
setAuthMode('login');
updateAppRoute();
initializeAuthentication();
