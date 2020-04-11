const app = new Vue ({
    el: '#app',
    data:{
        product:'Socks',
        image:'./resource/vmSocks-green-onWhite.jpg',
        onStock: true,
        details:['80% Cotton', '20% Polyester', 'Gender-neutral'],
        variants : [
            {
                variantId:2234 ,
                variantColor: 'green',
                variantImage: './resource/vmSocks-green-onWhite.jpg'
            },
            {
                variantId: 2235,
                variantColor: 'blue',
                variantImage: './resource/vmSocks-blue-onWhite.jpg'
            }
        ],

        cart: 0,
    },

    methods:{
        addToCart() {
            this.cart += 1
        },

        updateProduct(variantImage) {
            this.image = variantImage
        },

    }
})
