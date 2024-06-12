import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import * as QRCode from 'qrcode';

@Component({
  selector: 'app-qr',
  standalone: true,
  templateUrl: './qr.component.html',
  styleUrls: ['./qr.component.less'],
})
export class QrComponent implements AfterViewInit {
  @Input() url?: string | null = null;
  @ViewChild('qrcodeImg', { static: false })
  qrCode!: ElementRef<HTMLImageElement>;

  ngAfterViewInit(): void {
    if (this.url) {
      this.generateQRCode(this.url);
    }
  }

  private generateQRCode(url: string): void {
    QRCode.toDataURL(url, (error: any, dataUrl: string) => {
      if (error) {
        console.error(error);
      } else {
        this.qrCode.nativeElement.src = dataUrl;
      }
    });
  }
}
