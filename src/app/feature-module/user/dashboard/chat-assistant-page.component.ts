import { Component, OnInit } from '@angular/core';
import { routes } from '../../../shared/routes/routes';
import { CommonService } from '../../../shared/common/common.service';

@Component({
  selector: 'app-chat-assistant-page',
  templateUrl: './chat-assistant-page.component.html',
  styleUrls: ['./chat-assistant-page.component.scss'],
  standalone: false
})
export class ChatAssistantPageComponent implements OnInit {
  routes = routes;

  constructor(private common: CommonService) {}

  ngOnInit(): void {
    this.common.base.next('user');
    this.common.page.next('chat-assistant');
    this.common.last.next('');
  }
} 