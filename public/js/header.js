window.addEventListener('load',async()=>{

    const itemsMenu1 = document.getElementById('itemsMenu1')
    
    const itemMenu1 = document.getElementById('itemMenu1')
    const subItems1 = document.getElementById('subItems1')
    
    itemMenu1.addEventListener("mouseover",async(e)=>{
        subItems1.style.display = "flex"
    })

    itemsMenu1.addEventListener("mouseleave",async(e)=>{
        subItems1.style.display = "none"
    })
    
    
})




