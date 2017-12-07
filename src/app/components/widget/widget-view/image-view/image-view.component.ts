import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-image-view',
  templateUrl: './image-view.component.html',
  styleUrls: ['./image-view.component.css']
})
export class ImageViewComponent implements OnInit {

  @Input() url: string;
  @Input() width: string;

  baseUrl: string = environment.baseUrl;
  file: string;

  constructor() {
  }

  ngOnInit() {
  }
}
