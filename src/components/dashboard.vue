<template>
    <div>
        <article>
            <section>
                <form>
                    <input 
                    class="add_pdf"
                    type="file" accept="application/pdf" placeholder="選擇PDF檔案">
                </form>
            </section>
            <section v-show="!isActive">
                <h1>
                    Select a pdf file.
                </h1>
                <p>
                    Lorem ipsum dolor, sit amet consectetur adipisicing elit. Consectetur in distinctio voluptates harum non mollitia dolorem tempora esse sit libero. Voluptatum quaerat ad aperiam at, fugit eaque excepturi dolorem libero?
                </p>
            </section>
            <section v-show="isActive">
                <main class="canv">
                    <div class="sign">
                        <label for="tutorial">簽名</label>
                        <canvas class="canvas_sign_in" id="canvas_sign_in" width="150" height="150">canvas not showing</canvas>
                    </div>
                    <div class="img">
                        <label for="tutorial">預覽</label>
                        <img class="show-img" width="150" height="150"/>
                    </div>    
                    <div class="btn-group">
                        <button class="save">Confirm</button>
                        <button class="use_sign">Attach</button>
                        <button class="clear">Remake</button>
                    </div>
                    <div class="content">
                        <h2>Make a sign and click "Confirm"</h2>
                        <h3>After confirmed, u can attach the sign to pdf.</h3>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. At quam exercitationem nostrum maiores illum necessitatibus blanditiis nemo, quod reiciendis laborum sed, voluptates id repellendus a aperiam quia error ex. Deserunt?</p>
                    </div>
                </main>
            </section>
            <section class="outcome">
                <div>
                    <canvas class="canvas_pdf" id="canvas_pdf" width="150" height="150"></canvas>
                </div>
                <button class="download" @click="download" v-if="isActive">下載</button>
            </section>
        </article>
    </div>
</template>
<script setup>
import {ref, onMounted} from 'vue'
import canvas from '../utility/canvas.js'
import pdfSignIn from '../utility/pdf_trans_canvas.js'
// 引入套件所提供的物件
const isActive=ref();
const disable=ref();
const download = ()=>{
    const canvas = document.querySelector(".canvas_pdf");
    const pdf = new jsPDF();
  // 將 canvas 存為圖片
    const image = canvas.toDataURL("image/png");
    // 設定背景在 PDF 中的位置及大小
    const width = pdf.internal.pageSize.width;
    const height = pdf.internal.pageSize.height;
    pdf.addImage(image, "png", 0, 0, width, height);
    // 將檔案取名並下載
    pdf.save("download.pdf");
}
onMounted(async ()=>{
    canvas();
    pdfSignIn();
    document.querySelector("input").addEventListener("change", () => {
    isActive.value=true;
    disable.value=false
    })
})

</script>
<style scoped lang="scss">
    *{
        text-align:justify;
        margin-right: auto;
        font-size: small;
    }
    form {
        margin: 1em;
        padding: 1em;
        input {
            font-size: large;
            border-radius: 8px;
        }
    }
    .canv {
        display: flex;
        border-radius: 8px;
        border: 1px solid transparent;
        margin: 1em;
        padding: 1em;
        background-color: slategray;
        transition: border-color 0.25s;
        width:fit-content;
        .sign {
            text-align: left;
            margin: 0.5rem;
            .canvas_sign_in {
                height: 150px;
                background-color: white;
                border-radius: 8px;
            }
        }
        .img {
            text-align: left;
            margin: 0.5rem;
            border-radius: 8px;
            .show-img {
                background-color: white;
                border-radius: 8px;
            }
        }
        .btn-group {
            margin: 0.5rem;
            padding:1rem;
            button {
                font-size: small;
                margin-bottom: 0.3rem;
                width:4rem;
                background-color:steelblue;
            }
        }
        .content {
            overflow: scroll;
            height: 150px;
        }
    }
    .outcome {
        margin: 1em;
        /* padding:1em; */
        width:max-content;
    }
</style>
