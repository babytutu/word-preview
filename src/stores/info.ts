import { defineStore } from 'pinia'

export const useInfoStore = defineStore('info', {
  state: () => ({
    phone: '',
  }),
  actions: {
    /**
     * 保存登录的号码
     * @param {string} phone 值
     */
    setPhone(phone: string) {
      this.phone = phone
    },
  },
})
