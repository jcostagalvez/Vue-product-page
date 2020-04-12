Vue.component('product', {
    
    props:{
        premium:{
            type: Boolean,
            required: true,
        }

    },

    template: ` 
        <div class="product">
            <div class="product-image">
                <img v-bind:src="image"/>
            </div>
    
            <div class="product-info">
                <h1>{{ title }}</h1>
                <p v-show="inStock"> In stock</p>
                <p v-show="!inStock"> Out stock</p>
                <p>Shipping is {{shipping}}</p>
                <ul v-for="element in details">
                    <li> {{ element }} </li>
                </ul>

                <div v-for="(variant, index) in variants"
                :key="variant.variantId"
                class="color-box"
                :style="{background: variant.variantColor}"
                @mouseover="updateProduct(index)"> </div>
 
                <button v-on:click="addToCart" 
                :disabled="!inStock"
                :class="{disabledButton : !inStock}">Add to Cart</button>
            </div>
            <product-review @sent-form="addReview"></product-review>
        </div>
    `,

data(){
    return{ 
        brand:'Vue Mastery',
        selectedVariant: 0,
        details:['80% Cotton', '20% Polyester', 'Gender-neutral'],
        variants : [
            {
                variantId:2234 ,
                variantColor: 'green',
                variantImage: './resource/vmSocks-green-onWhite.jpg',
                variantQuantity: 10,
            },
            {
                variantId: 2235,
                variantColor: 'blue',
                variantImage: './resource/vmSocks-blue-onWhite.jpg',
                variantQuantity: 0,
            }
        ],
        reviews: [],
    }
},
methods:{
    addToCart() {
        this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId);
    },

    updateProduct(index) {
        this.selectedVariant = index
    },

    addReview(review){
        this.reviews.push(review);
    }


},

computed:{
    title() {
        return `${this.product} ${this.brand}`;
    },

    image() {
        return this.variants[this.selectedVariant].variantImage;
    },

    inStock() {
        return this.variants[this.selectedVariant].variantQuantity > 0 ? true : false;           
    },

    shipping() {
        return this.premium === true? 'free': '2.99$';
    },
}

})

Vue.component('product-review', {

    template: `
      <form class="review-form" @submit.prevent="onSubmit">
      
        <p class="error" >
          <b>Please correct the following error(s):</b>
          <ul>
            <li>{{  }}</li>
          </ul>
        </p>

        <p>
          <label for="name">Name:</label>
          <input id="name" v-model="name">
        </p>
        
        <p>
          <label for="review">Review:</label>      
          <textarea id="review" v-model="review" ></textarea>
        </p>
        
        <p>
          <label for="rating">Rating:</label>
          <select id="rating" v-model.number="raiting">
            <option>5</option>
            <option>4</option>
            <option>3</option>
            <option>2</option>
            <option>1</option>
          </select>
        </p>
            
        <p>
          <input type="submit" value="Submit" >  
        </p>    
      
    </form>
    `,

    data(){
        return{
            name:null,
            raiting:null,
            review:null,

        }
    },

    methods:{
        onSubmit(){
            let productReview = {
                name: this.name,
                raiting: this.raiting,
                review: this.review
            };
            this.$emit('sent-form',productReview)
            this.name = null;
            this.raiting = null;
            this.review = null;

        }
    }
})

const app = new Vue ({
    el: '#app',
    data:{
        isPremium: true,
        cart: [],
    },

    methods:{
        updateCart(id) {
            this.cart.push(id);
        }
    }
    
})
