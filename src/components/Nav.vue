<script setup>
import { useAuthStore } from '@/stores';

const authStore = useAuthStore();
</script>

<template>
    <nav v-show="authStore.user"  class="navbar navbar-expand" style=" display: flex; justify-content: space-between;">
            <router-link to="/" class="nav-item nav-link" style="color: black;">Home</router-link>
            <button @click="authStore.logout()" class="btn btn-link nav-item nav-link" style="color: red;">Logout</button>
    </nav>
</template>