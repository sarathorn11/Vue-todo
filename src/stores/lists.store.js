import { defineStore } from 'pinia';

import { fetchWrapper } from '@/helpers';
import { useListStore } from '@/stores';

const baseUrl = `${import.meta.env.VITE_API_URL}/lists`;

export const useListsStore = defineStore({
    id: 'lists',
    state: () => ({
        lists: {},
        list: {}
    }),
    actions: {
        async createList(list) {
            await fetchWrapper.post(`${baseUrl}/create`, list);
        },
        async getAll() {
            this.lists = { loading: true };
            try {
                this.lists = await fetchWrapper.get(baseUrl);    
            } catch (error) {
                this.lists = { error };
            }
        },
        async getById(id) {
            this.list = { loading: true };
            try {
                this.list = await fetchWrapper.get(`${baseUrl}/${id}`);
            } catch (error) {
                this.list = { error };
            }
        },
        async update(id, params) {
            await fetchWrapper.put(`${baseUrl}/${id}`, params);
            // update stored list if the logged in list updated their own record
            const authStore = useListStore();
            if (id === params.id) {
                // update local storage
                const list = { ...authStore.list, ...params };
                localStorage.setItem('list', JSON.stringify(list));

                // update auth list in pinia state
                authStore.list = list;
            }
        },
        async delete(id) {
            // add isDeleting prop to list being deleted
            this.lists.find(x => x.id === id).isDeleting = true;

            await fetchWrapper.delete(`${baseUrl}/${id}`);

            // remove list from list after deleted
            this.lists = this.lists.filter(x => x.id !== id);

        }
    }
});
