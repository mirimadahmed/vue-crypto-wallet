import VueI18n from 'vue-i18n'
import Vue from 'vue'
import en from '@/lang/en.json'
import tr from '@/lang/tr.json'

Vue.use(VueI18n)
export const i18n = new VueI18n({
  locale: "en", // set locale
  fallbackLocale: "tr",
  messages: { en, tr }// set locale messages
})