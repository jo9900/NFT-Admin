import Vue from "vue";
import Vuetify from "vuetify/lib/framework";

Vue.use(Vuetify);
import zhHans from 'vuetify/es5/locale/zh-Hans'
import en from 'vuetify/es5/locale/en'
export default new Vuetify({

  lang: {
    locales: { zhHans, en },
    current: 'zhHans',
  },
  theme: {
    themes: {
      light: { primary: "#303030" },
    },
  },
});
