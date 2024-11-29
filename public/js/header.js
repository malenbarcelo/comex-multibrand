window.addEventListener('load',async()=>{
    
    ////////////GENERAL DATA MENU////////////
    const itemsMenu1 = document.getElementById('itemsMenu1')
    const itemMenu1 = document.getElementById('itemMenu1')
    const subItems1 = document.getElementById('subItems1')

    itemMenu1.addEventListener("mouseover",async(e)=>{
        subItems1.style.display = "flex"
    })

    itemsMenu1.addEventListener("mouseleave",async(e)=>{
        subItems1.style.display = "none"
    })

    ////////////STATISTICS MENU////////////
    // const itemsMenu3 = document.getElementById('itemsMenu3')
    // const itemMenu3 = document.getElementById('itemMenu3')
    // const subItems3 = document.getElementById('subItems3')

    // itemMenu3.addEventListener("mouseover",async(e)=>{
    //     subItems3.style.display = "flex"
    // })

    // itemsMenu3.addEventListener("mouseleave",async(e)=>{
    //     subItems3.style.display = "none"
    // })
    
    
})




