import { Renderer2, Component, ElementRef, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Product } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

  imagesmock = [
    "../../../assets/1m.png",
    "../../../assets/2m.png",
    "../../../assets/3m.png",
    "../../../assets/4m.png"
    // Agrega más imágenes aquí
  ];

  currentImage = this.imagesmock[0];
  texts: string[] = [ "BE","WEAR", "EXPLORE", "DISCOVER"];
  products: Product[] = [];
  index: number = 0;
  currentText = this.texts[this.index];

  authors = ['Emily', 'Savanna', 'Ivie', 'Jared'];
  reviews = ['The product is great, the printing is very well done. I\'m very happy.', 
  'Love love LOVE this sweatshirt! The quality is excellent and came just in time for Sonic Expo!',
  'Very cute shirt cute fit >:)',
  'For any sonic fans, I’ve got myself an XL for oversized fit and it feels pretty good! Not too light but not too heavy, just right!!'];
  images = ['../../../assets/review1.webp', '../../../assets/review2.webp', '../../../assets/review3.webp','../../../assets/review4.webp'];
  countdown: any = {
    days: 0,
    minutes: 0,
    seconds: 0
  };  


  constructor(private productService: ProductService, private el: ElementRef, private renderer: Renderer2) { }
  ngOnInit(): void {
    this.startCountdown();
    this.getOffer();
  }



  startCountdown() {
    setInterval(() => {
      const now = moment().tz("America/New_York");
      const nextMonday = now.clone().day(8).hour(0).minute(1).second(0);
      const duration = moment.duration(nextMonday.diff(now));
      this.countdown = {
        days: Math.floor(duration.asDays()),
        minutes: duration.minutes(),
        seconds: duration.seconds()
      };
    }, 1000);
  }

  getOffer() {
    this.productService.getOffer().subscribe((result) => {
      this.products = result.map((product) => ({
        ...product,
        key: product.key || undefined,
      }));
    });
  }

  ngAfterViewInit() {
    const reviewsht = this.el.nativeElement.querySelectorAll('.review');
    reviewsht.forEach((reviewht: HTMLElement, index: number) => {
      if (index !== 0) {
        reviewht.style.animationDelay = `${index * 5}s`;
      }
    });
  
    const imgshirt = this.el.nativeElement.querySelectorAll('.superimposed-image');
    imgshirt.forEach((imgshirt: HTMLElement, index: number) => {
      if (index !== 0) {
        imgshirt.style.animationDelay = `${index * 5}s`;
      }
    });
  }


  


  
  
}