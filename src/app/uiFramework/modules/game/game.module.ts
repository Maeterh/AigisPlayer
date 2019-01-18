import { NgModule } from '@angular/core';
import { GameComponent } from './game.component';
import { WebviewDirective } from './webview.directive';
import { SharedModule } from '../../../shared.module';
import { FakeWebviewComponent } from './fake-webview/fake-webview.component';

@NgModule({
    declarations: [GameComponent, WebviewDirective, FakeWebviewComponent],
    imports: [SharedModule],
    exports: [GameComponent]
})
export class GameModule {

}
