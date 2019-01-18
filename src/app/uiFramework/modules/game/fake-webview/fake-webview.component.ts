import { Component, AfterViewInit, OnDestroy, Input, ElementRef } from '@angular/core';
import { WebPreferences, BrowserView } from 'electron';
import { ElectronService } from '../../../../core/electron.service';
import { GameService } from '../../../../core/game.service';
import { GlobalStatusService } from '../../../../global/globalStatus.service';


@Component({
    selector: 'app-webview',
    templateUrl: './fake-webview.component.html',
    styleUrls: ['./fake-webview.component.scss'],
})
export class FakeWebviewComponent implements AfterViewInit, OnDestroy {
    private _src = 'http://www.baidu.com';
    private browserView: BrowserView;
    @Input()
    set src(value: string) {
        this._src = value;
        // 控制view
        if (this.browserView) {
            this.browserView.webContents.loadURL(value);
        }
    }
    get src() {
        return this._src;
    }

    @Input() public webpreferences: WebPreferences = {};
    @Input() public preload: string;
    @Input() public useragent: string;

    constructor(
        private electronService: ElectronService,
        private gameService: GameService,
        private globalStatus: GlobalStatusService,
        private element: ElementRef,
    ) {
        // 订阅SetZoom事件
        globalStatus.GlobalStatusStore.Get('SetZoom').Subscribe(() => {
            this.setViewPosition();
        })
    }

    setViewPosition() {
        const frame: Element = this.element.nativeElement.querySelector('#frame');
        // position & size
        if (this.browserView) {
            this.browserView.setBounds({
                x: frame.clientTop,
                y: frame.clientLeft + 24,
                width: frame.clientWidth,
                height: frame.clientHeight
            })
            // zoom
            this.browserView.webContents.setZoomFactor(
                this.globalStatus.GlobalStatusStore.Get('Zoom').Value
            );
        }
    }
    ngAfterViewInit() {
        // 创建view
        this.browserView = new this.electronService.electron.remote.BrowserView({
            webPreferences: this.webpreferences,
        })
        this.electronService.currentWindow.setBrowserView(this.browserView);
        this.browserView.webContents.loadURL(this.src);
        this.setViewPosition();
        this.browserView.webContents.openDevTools();
    }
    ngOnDestroy() {
        // 摧毁view
        this.browserView.destroy();
    }
}
