<script setup>
import { storeToRefs } from 'pinia';

import { useListsStore } from '@/stores';

const listsStore = useListsStore();
const { lists } = storeToRefs(listsStore);


listsStore.getAll();
</script>

<template>
    <h1>Lists</h1>
    <router-link to="/lists/add" class="btn btn-sm btn-success mb-2">Add List</router-link>
    <table class="table table-striped">
        <thead>
            <tr>
                <th style="width: 90%">Name</th>
                <th style="width: 10%"></th>
            </tr>
        </thead>
        <tbody>
            <template v-if="lists.length">
                <tr v-for="list in lists" :key="list.id">
                    <td>{{ list.todo }}</td>
                    <td style="white-space: nowrap">
                        <router-link :to="`/lists/edit/${list.id}`" class="btn btn-sm btn-primary mr-1">Edit</router-link>
                        <button @click="listsStore.delete(list.id)" class="btn btn-sm btn-danger btn-delete-list" :disabled="list.isDeleting">
                            <span v-if="list.isDeleting" class="spinner-border spinner-border-sm"></span>
                            <span v-else>Delete</span>
                        </button>
                    </td>
                </tr>
            </template>
            <tr v-if="lists.loading">
                <td colspan="4" class="text-center">
                    <span class="spinner-border spinner-border-lg align-center"></span>
                </td>
            </tr>
            <tr v-if="lists.error">
                <td colspan="4">
                    <div class="text-danger">Error loading lists: {{lists.error}}</div>
                </td>
            </tr>            
        </tbody>
    </table>
</template>
