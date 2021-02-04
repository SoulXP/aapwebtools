<template>
    <form id="badline-form" action="" novalidate>
        <div class="form-group">
            <div class="form-element">
                <label for="show">Show Name</label>
                <select v-model="showName" name="show">
                    <option v-for="name in showNames" :key="name">{{ name }}</option>
                </select>
            </div>
            <div class="form-element">
                <label for="character">Character Name</label>
                <input v-model="characterName" type="text" id="character_name">
            </div>
        </div>
        <div class="form-element">
            <label for="line">Line</label>
            <textarea v-model="line" name="line" id="line" cols="30" rows="10"></textarea>
        </div>
        <button @click.prevent="validateForm()">Submit</button>
    </form>
</template>

<script>
import services from '@/services/services.js';

export default {
    name: 'BadLineForm',
    data () {
        return {
            showNames: [
                'One',
                'Two',
                'Three'
            ],
            characterName: '',
            line: ''
        }
    },
    methods: {
        validateForm () {
            // Send to api for logging
            services.addBadLine({ type: 'badline-form', formdata: { show: this.showName, character: this.characterName, line: this.line } })
                .then((res) => {
                    console.log(res);
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        sendPost (formData) {
            services.dev_get()
                .then((res) => {
                    console.log(res.data);
                })
                .catch((err) => {
                    console.error(err);
                });
        }
    }
}
</script>

<style scoped>
    * {
        margin: 0;
        box-sizing: border-box;
        font-family: 'Poppins', sans-serif;
    }

    #badline-form {
        display: flex;
        margin: 0;
        max-width: 500px;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin-top: 0.5em;
    }

    #badline-form input {
        max-width: 250px;
        margin-top: 0.5em;
        padding: 0.75em;
        border: 0.1em solid black;
        border-radius: 4px;
    }

    #badline-form input:focus, #badline-form textarea:focus, #badline-form select:focus {
        outline: none;
    }

    #badline-form textarea {
        resize: none;
        width: 100%;
        height: 200px;
        padding: 0.75em;
        margin-top: 0.5em;
        border: 0.1em solid black;
        border-radius: 4px;
    }

    #badline-form select {
        max-width: 250px;
        margin-top: 0.5em;
        padding: 0.75em;
        border: 0.1em solid black;
        border-radius: 4px;
    }

    #badline-form button {
        max-width: 250px;
        margin-top: 0.5em;
    }

    #badline-form .form-group {
        display: flex;
        width: 100%;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
    }

    #badline-form .form-element {
        display: flex;
        min-width: 100%;
        flex-direction: column;
        justify-content: space-between;
        margin-top: 0.5em;
    }
</style>
