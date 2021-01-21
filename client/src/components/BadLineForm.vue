<template>
    <form id="badline-form" action="" novalidate>
        <div class="form-group">
            <div class="form-element">
                <label for="show">Show Name</label>
                <select name="show">
                    <option>One</option>
                    <option>Two</option>
                    <option>Three</option>
                </select>
            </div>
            <div class="form-element">
                <label for="character">Character Name</label>
                <input type="text" id="character_name">
            </div>
        </div>
        <label for="line">Line</label>
        <textarea name="line" id="line" cols="30" rows="10"></textarea>
        <button>Submit</button>
    </form>
</template>

<script>
export default {
    name: 'BadLineForm'
}
</script>

<style scoped>
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    #badline-form {
        display: flex;
        max-width: 500px;
        flex-direction: column;
        justify-content: center;
        align-content: center;
    }

    #badline-form input {
        max-width: 250px;
    }

    #badline-form textarea {
        resize: none;
        width: 100%;
        height: 200px;
        padding: 0.5em;
    }

    #badline-form select {
        max-width: 250px;
    }

    #badline-form button {
        max-width: 250px;
    }

    #badline-form .form-group {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-content: center;
    }

    #badline-form .form-element {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-content: center;
    }
</style>
