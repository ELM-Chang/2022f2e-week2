export default (async ()=>{
    const Base64Prefix = "data:application/pdf;base64,";
    // const add = document.querySelector(".add");
    pdfjsLib.GlobalWorkerOptions.workerSrc = "https://mozilla.github.io/pdf.js/build/pdf.worker.js";

    // 使用原生 FileReader 轉檔
    function readBlob(blob) {
        return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.addEventListener("load", () => resolve(reader.result));
        reader.addEventListener("error", reject);
        reader.readAsDataURL(blob);
        });
    }

    async function printPDF(pdfData) {

    // 將檔案處理成 base64
    pdfData = await readBlob(pdfData);

    // 將 base64 中的前綴刪去，並進行解碼
    const data = atob(pdfData.substring(Base64Prefix.length));

    // 利用解碼的檔案，載入 PDF 檔及第一頁
    const pdfDoc = await pdfjsLib.getDocument({ data }).promise;
    const pdfPage = await pdfDoc.getPage(1);

    // 設定尺寸及產生 canvas
    const viewport = pdfPage.getViewport({ scale: window.devicePixelRatio });
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    // 設定 PDF 所要顯示的寬高及渲染
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    const renderContext = {
        canvasContext: context,
        viewport,
    };
    const renderTask = pdfPage.render(renderContext);

    // 回傳做好的 PDF canvas
    return renderTask.promise.then(() => canvas);
    }

    async function pdfToImage(pdfData) {
        // 設定 PDF 轉為圖片時的比例
        const scale = 1 / window.devicePixelRatio;

        // 回傳圖片
        return new fabric.Image(pdfData, {
            id: "renderPDF",
            scaleX: scale,
            scaleY: scale,
            });
    }
    // 此處 canvas 套用 fabric.js
    document.querySelector("input").addEventListener("change", async (e) => {
        const canvas = new fabric.Canvas("canvas_pdf");
        canvas.requestRenderAll();
        const pdfData = await printPDF(e.target.files[0]);
        const pdfImage = await pdfToImage(pdfData);

        // 透過比例設定 canvas 尺寸
        canvas.setWidth(pdfImage.width / window.devicePixelRatio);
        canvas.setHeight(pdfImage.height / window.devicePixelRatio);

        // 將 PDF 畫面設定為背景
        canvas.setBackgroundImage(pdfImage, canvas.renderAll.bind(canvas));
        // 初始化以及加入新的簽章
        clean(canvas);
        signIn(canvas);
    });
    const signIn = async (canvas) => {
        const useSign = document.querySelector(".use_sign");
        useSign.addEventListener("click", async ()=>{ await add_sign(canvas)});
    }
    const add_sign= async (canvas)=>{
        const imgUrl=localStorage.getItem("img");
        if (!imgUrl){
            alert("Please Confirm Any Sign Before Added")
            return
        };   
        // 先清除舊的簽章
        if (canvas.getObjects().length>0) clean(canvas)
        fabric.Image.fromURL(imgUrl, function (image) { 
            // 設定簽名出現的位置及大小，後續可調整
            image.top = 580;
            image.left= 400;
            image.scaleX = 0.5;
            image.scaleY = 0.5;
            canvas.add(image);
        });
    }        
    const clean = async (canvas)=>{
        // console.log("clean!")
        const target = canvas.getObjects();
        target.forEach(e => {
            canvas.remove(e)
        });
    }
})