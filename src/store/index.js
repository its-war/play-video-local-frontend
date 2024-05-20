import {defineStore} from "pinia";

export default defineStore('main', {
    state: () => ({
        pageLoading: false,
        mobile: false
    }),
    getters: {
        isLoading: (state) => {
            return state.pageLoading;
        },
        isMobile: (state) => {
            return state.mobile;
        }
    },
    actions: {
        setPageLoading(value){
            this.pageLoading = value;
        },
        setMobile(value){
            this.mobile = value;
        }
    }
});