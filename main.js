var eventBus = new Vue();

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
                :class="{disabledButton : !inStock}">Add to Cart
                </button>
                </div> 

            <div>
                <product-tabs :reviews="reviews"></product-tabs>
            </div>
        </div>
    `,

data(){
    return{ 
        brand:'Vue Mastery',
        product: 'Socks',
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
},

mounted(){

    eventBus.$on('sent-form', productReview => {
        this.reviews.push(productReview);
    })
}


})

Vue.component('product-review', {

    template: `
      <form class="review-form" @submit.prevent="onSubmit">
      
        <p class="error" v-show="errors.length > 0">
          <b>Please correct the following {{errorMessage}} :</b>
          <ul v-for="error in errors">
            <li>{{error}}</li>
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
        
        <div class ="checkbox-form">
            <label>¿Do you recommend this product?</label>
            <input type="checkbox" v-model="recommend">
        </div>   
        
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
            recommend:null,
            errors:[],
        }
    },

    methods:{
        onSubmit(){
            if(this.name && this.raiting && this.review){
                let productReview = {
                    name: this.name,
                    raiting: this.raiting,
                    review: this.review,
                    recommend: this.recommend === true ? 'Recomiendo este producto' : 'No recomiendo este producto',
                };
                eventBus.$emit('sent-form',productReview)
                this.name = null;
                this.raiting = null;
                this.review = null;
                this.recommend = null;
            }else{
                if(!this.name) this.errors.push('The name is required');
                if(!this.raiting) this.errors.push('The raiting is required');
                if(!this.review) this.errors.push('The review is required');
            }
        }
    },
    
    computed:{
        errorMessage () {
            return this.errors.length > 1? 'errors': 'error';
        }
    }

})

Vue.component('product-tabs', {
    props:{
        reviews:{
            type:Array,
            required:true,
        }

    },
    template: `
            <div>
                <span
                class="tab title-form"
                :class="{activeTab: selectedTab === tab}" 
                v-for="(tab, index) in tabs" :key="index"
                @click="selectedTab = tab"> {{ tab }} </span>
            

                <div v-show="selectedTab === 'Make a Review'">
                    <product-review></product-review>
                </div>

                <div v-show="selectedTab === 'Reviews'">
                    <p v-show="reviews.length === 0" class="form-text"> No reviews yet for this product </p>
                    <ul v-show="reviews.length > 0"> 
                        <li v-for="review in reviews">
                        <p>{{review.name}}</p> 
                        <p>raiting: {{review.raiting}}</p> 
                        <p>{{review.review}}</p>
                        <p>{{review.recommend}}</p> 
                        </li>
                    </ul>
                </div>
            </div>
        `,
        data() {
            return {
              tabs: ['Reviews', 'Make a Review'],
              selectedTab: 'reviews',
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
