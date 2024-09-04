<template>
    <div class="container">
        <div class="note">
            版本标注
        </div>
        <div class="column">
            <div class="content">
                巴拉巴拉
            </div>
            <div class="msg">
                别的杂七杂八的
                <p>滚</p><p>动</p><p>滚</p><p>动</p><p>滚</p><p>动</p>
                <p>滚</p><p>动</p><p>滚</p><p>动</p><p>滚</p><p>动</p>
                <p>滚</p><p>动</p><p>滚</p><p>动</p><p>滚</p><p>动</p>
            </div>
        </div>
    </div>

</template>
<script>
export default{
    name:'homeIndex'
}
</script>
<style lang="scss" scoped>
.container {
    height: 100%;
    display: flex;
    flex-direction: column;

    .note {
        flex: 2;
        padding: 3rem;
        margin: 0 1rem 1rem;
        border-radius: 0.3rem;
        background-color: white;
        text-align: center;
    }

    .column {
        flex: 50;
        display: flex;
        justify-content: space-around;

        .content {
            flex: 6;
            background-color: white;
            margin: 0 1rem;
            border-radius: 0.3rem;
            height:fit-content;
            padding: 1rem;
        }

        .msg {
            flex: 4;
            background-color: white;
            margin: 0 1rem 0 0;
            padding: 1rem;
            border-radius: 0.3rem;
        }
    }
}
</style>
