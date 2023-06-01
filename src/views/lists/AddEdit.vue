<script setup>
import { Form, Field } from 'vee-validate';
import * as Yup from 'yup';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';

import { useListsStore, useAlertStore } from '@/stores';
import { router } from '@/router';


const listsStore = useListsStore();
const alertStore = useAlertStore();
const route = useRoute();
const id = route.params.id;
const date = new Date().toJSON();;

let title = 'Add ToDo Lists';
let list = null;
if (id) {
    // edit mode
    title = 'Edit List';
    ({ list } = storeToRefs(listsStore));
    listsStore.getById(id);
}

const schema = Yup.object().shape({
    todo: Yup.string()
        .required('List Name is required'),
});

async function onSubmit(values) {
    var e = document.getElementsByName("condition")[0];
    var condi = e.options[e.selectedIndex].value;
    values['isCompleted']=condi;
    values['createdAt']=date
    try {
        let message;
        if (list) {
            await listsStore.update(list.value.id, values)
            message = 'list updated';
        } else {
            await listsStore.createList(values);
            message = 'list added';
        }
        await router.push('/lists');
        alertStore.success(message);
    } catch (error) {
        alertStore.error(error);
    }
}
</script>

<template>
    <h1>{{title}}</h1>
    <template v-if="!(list?.loading || list?.error)">
        <Form @submit="onSubmit" :validation-schema="schema" :initial-values="list" v-slot="{ errors, isSubmitting }">
            <div class="form-row">
                <div class="form-group col">
                    <label>List Name</label>
                    <Field name="todo" type="text" class="form-control" :class="{ 'is-invalid': errors.todo }" />
                    <div class="invalid-feedback">{{ errors.todo }}</div>
                </div>
                <div class="form-group col">
                    <label>Does it's Completed</label>
                    <select class="form-control" name="condition" id="condition" :class="{ 'is-invalid': errors.condition }">
                        <option  value="true">Yes</option>
                        <option value="fales">No</option>
                    </select>
                    <div class="invalid-feedback">{{ errors.condition }}</div>
                </div>
            </div>
            <div class="form-group">
                <button class="btn btn-primary" :disabled="isSubmitting">
                    <span v-show="isSubmitting" class="spinner-border spinner-border-sm mr-1"></span>
                    Save
                </button>
                <router-link to="/lists" class="btn btn-link">Cancel</router-link>
            </div>
        </Form>
    </template>
    <template v-if="list?.loading">
        <div class="text-center m-5">
            <span class="spinner-border spinner-border-lg align-center"></span>
        </div>
    </template>
    <template v-if="list?.error">
        <div class="text-center m-5">
            <div class="text-danger">Error loading list: {{list.error}}</div>
        </div>
    </template>
</template>
