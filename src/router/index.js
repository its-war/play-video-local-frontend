import { createRouter, createWebHistory } from 'vue-router'
import Store from '@/store'

//componentes
import HomeComponent from "@/components/HomeComponent.vue";
import ListarVideos from "@/components/ListarVideos.vue";
import UploadComponent from "@/components/UploadComponent.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            component: HomeComponent,
            children: [
                {
                    path: '',
                    name: 'Listar',
                    component: ListarVideos
                },
                {
                    path: 'upload',
                    name: 'Upload',
                    component: UploadComponent
                }
            ]
        }
    ]
})

router.beforeEach((to, from, next) => {
    const store = Store();
    store.setPageLoading(true);
    next();
})

router.afterEach(() => {
    const store = Store();
    store.setPageLoading(false);
})

export default router