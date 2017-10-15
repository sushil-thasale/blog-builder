import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { WidgetService } from '../../../../services/widget.service.client';
import { Input } from '@angular/core';

@Component({
  selector: 'app-widget-youtube',
  templateUrl: './widget-youtube.component.html',
  styleUrls: ['./widget-youtube.component.css']
})
export class WidgetYoutubeComponent implements OnInit {
  userID: string;
  websiteID: string;
  pageID: string;
  widget: any;
  youtubeUrl: string;
  width: string;

  @Input() widgetID: string;

  constructor(private widgetService: WidgetService, private router: Router, private  route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.userID = params['userID'];
      this.websiteID = params['websiteID'];
      this.pageID = params['pageID'];
    });
    this.widget = this.widgetService.findWidgetById(this.widgetID);
    this.youtubeUrl = this.widget.url;
    this.width = this.widget.width;
  }

  updateWidget() {
    this.widget.url = this.youtubeUrl;
    this.widget.width = this.width;
    this.widgetService.updateWidget(this.widgetID, this.widget);
    this.navigateToWidgetList();
  }

  deleteWidget() {
    this.widgetService.deleteWidget(this.widgetID);
    this.navigateToWidgetList();
  }

  navigateToWidgetList() {
    this.router.navigate(['/user', this.userID, 'website', this.websiteID, 'page', this.pageID, 'widget']);
  }

  navigateToProfile() {
    this.router.navigate(['/user', this.userID]);
  }
}
