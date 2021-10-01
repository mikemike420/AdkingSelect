<template>
    <default-field  v-if="show" :field="field" :errors="errors">
        <template slot="field">
            <select
                :id="field.attribute"
                v-model="value"
                class="w-full form-control form-select"
                :class="errorClasses"

            >
                <option value selected>{{ __('Choose an option') }}</option>
                <option
                    :key="option.value"
                    :value="option.value"
                    v-for="option in options"
                >{{ option.label }}</option>
            </select>
        </template>
    </default-field>
</template>

<script>
import { FormField, HandlesValidationErrors } from "laravel-nova";
export default {
    mixins: [FormField, HandlesValidationErrors],
    props: ["resourceName", "resourceId", "field"],
    data() {
        return {
            parentValue: null,
            loaded: false,
            options: [],
            show: false,
        };
    },
    mounted() {
        this.watchedComponents.forEach(component => {
            let attribute = "value";
            if (component.field.component === "belongs-to-field") {
                attribute = "selectedResource";
            }
            component.$watch(
                attribute,
                value => {
                    this.parentValue =
                        value && attribute == "selectedResource"
                            ? value.value
                            : value;
                    this.updateOptions();
                },
                { immediate: true }
            );
        });
    },
    computed: {
        watchedComponents() {
            return this.$parent.$children.filter(component => {
                return this.isWatchingComponent(component);
            });
        },
        disabled() {
            return this.options.length == 0;
        }
    },
    methods: {
        setInitialValue() {
            this.value = "";
        },
        fill(formData) {
            formData.append(this.field.attribute, this.value || "");
        },
        updateOptions() {
            this.value = "";
            this.loaded = false;
            if (this.parentValue != null && this.parentValue != "") {

                    axios.get(`/api/choices/${this.parentValue}`)
                    .then(response => {

                        this.loaded = true;
                        this.options = response.data;
                        let optionValueExists = false;
                        console.log(this.options)
                        this.show = true

                    }).catch(error => {
                        this.show = false;
                    });
            }
        },
        isWatchingComponent(component) {
            return (
                component.field !== undefined &&
                component.field.attribute == this.field.parentAttribute
            );
        }
    }
};
</script>
