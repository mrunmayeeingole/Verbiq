export default class CommonConstants {
  public static APP_VERSION = '1.0.0';

  public static HIDE_TAB_PAGES: Array<string> = [""];
  public static HIDE_LOCATION_BAR_PAGES: Array<string> = [""];

  // Storage Keys
  public static INTRO_KEY = 'introSeen_Verbiq';
  public static TOKEN_KEY = "accessToken_Verbiq";
  public static LANGUAGE_KEY = "selectedLanguage_Verbiq";
  public static USER_DETAILS_KEY = "userDetails_Verbiq";
  public static PUSH_TOKEN = 'pushToken_Verbiq';

  public static CLASSES: any = [
    { key: '1', value: 'Class 1' ,disabled: false},
    { key: '2', value: 'Class 2' ,disabled: false},
    { key: '3', value: 'Class 3' ,disabled: false},
    { key: '4', value: 'Class 4' ,disabled: false},
    { key: '5', value: 'Class 5' ,disabled: false},
    { key: '6', value: 'Class 6' ,disabled: false},
    { key: '7', value: 'Class 7' ,disabled: false},
    { key: '8', value: 'Class 8' ,disabled: false},
    { key: '9', value: 'Class 9' ,disabled: false},
    { key: '10', value: 'Class 10' ,disabled: false},
    { key: '11', value: 'Class 11' ,disabled: false},
    { key: '12', value: 'Class 12' ,disabled: false},
  ];

  public static MEDIUM: any =  [
    { key: 'marathi', value: 'Marathi' },
    { key: 'english', value: 'English' },
    { key: 'hindi', value: 'Hindi' },
    { key: 'semiEnglish', value: 'Semi English' },
  ];


  // Variables Key
  public static ALPHABETS = "abcdefghijklmnopqrstuvwxyz";

  public static QA_Resources: any = [
    {
      languageId: "1",
      href: "https://curiotory-my.sharepoint.com/personal/kalyani_curiotory_com/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fkalyani%5Fcuriotory%5Fcom%2FDocuments%2FLanguage%20Q%26A%2FMandarin%20Q%20%26A&ga=1"
    },
    {
      languageId: "2",
      href: "https://curiotory-my.sharepoint.com/personal/kalyani_curiotory_com/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fkalyani%5Fcuriotory%5Fcom%2FDocuments%2FLanguage%20Q%26A%2FGerman%20Q%20%26%20A&ga=1"
    },
    {
      languageId: "3",
      href: "https://curiotory-my.sharepoint.com/personal/kalyani_curiotory_com/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fkalyani%5Fcuriotory%5Fcom%2FDocuments%2FLanguage%20Q%26A%2FFrench%20Q%26%20A&ga=1"
    },
    {
      languageId: "4",
      href: "https://curiotory-my.sharepoint.com/personal/kalyani_curiotory_com/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fkalyani%5Fcuriotory%5Fcom%2FDocuments%2FLanguage%20Q%26A%2FSpanish%20Q%20%26%20A&ga=1"
    },

  ];
}

export class AppConfigConstants {
  public static APP_CONFIG: any = {
    menuType: "sidemenu_tabs" /** sidemenu | tabs | sidemenu_tabs */,
  };
}

export class RouteConstants {
  public static SIDE_MENU: any = [
    {
      title: "Subscription Plans",
      icon: "card-outline",
      image: "",
      urlPath: "",
      path: "",
      parent: "",
      isSidemenu: true,
      isTab: false,
    },
    {
      title: "Learn More",
      icon: "reader-outline",
      image: "",
      urlPath: "",
      path: "",
      parent: "",
      isSidemenu: true,
      isTab: false,
    },
    {
      title: "Contact Us",
      icon: "call-outline",
      image: "",
      urlPath: "",
      path: "",
      parent: "",
      isSidemenu: true,
      isTab: false,
    },
    {
      title: "About Us",
      icon: "information-circle-outline",
      image: "",
      urlPath: "",
      path: "",
      parent: "",
      isSidemenu: true,
      isTab: false,
    },
    {
      title: "Terms & Condition",
      icon: "calendar-clear-outline",
      image: "",
      urlPath: "",
      path: "",
      parent: "",
      isSidemenu: true,
      isTab: false,
    },
    {
      title: "FAQ",
      icon: "chatbox-ellipses-outline",
      image: "",
      urlPath: "",
      path: "",
      parent: "",
      isSidemenu: true,
      isTab: false,
    },
    {
      title: "Rate Us",
      icon: "star-outline",
      image: "",
      urlPath: "",
      path: "",
      parent: "",
      isSidemenu: true,
      isTab: false,
    },
    {
      title: "Share",
      icon: "paper-plane-outline",
      image: "",
      urlPath: "",
      path: "",
      parent: "",
      isSidemenu: true,
      isTab: false,
    },
    {
      title: "Ask The Expert",
      icon: "chatbubbles-outline",
      image: "",
      urlPath: "",
      path: "",
      parent: "",
      isSidemenu: true,
      isTab: false,
    },
  ];

  public static ROUTE_REGISTRY: any = [
    {
      title: "Orders",
      icon: "bi bi-cart-check",
      image: "",
      urlPath: "/pages/orders",
      path: "orders",
      parent: "App",
      isMenuTab: true,
      isPartOfRouting: true,
      children: [],
    },
  ];
}

