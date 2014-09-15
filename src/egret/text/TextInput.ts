/**
 * Copyright (c) 2014,Egret-Labs.org
 * All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of the Egret-Labs.org nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY EGRET-LABS.ORG AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL EGRET-LABS.ORG AND CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */


module egret {
    export class TextInput extends Sprite {

        private _text:TextField;
        private stageText:egret.StageText;

        constructor() {
            super();
            this._text = new egret.TextField();
            this.addChild(this._text);
            this._text.size = 30;

            this.stageText = egret.StageText.create();
            var point = this.localToGlobal();
            this.stageText._open(point.x, point.y, this._explicitWidth, this._explicitHeight);
        }

        public _onAddToStage():void {
            super._onAddToStage();

            this.graphics.beginFill(0xffffff, 0);
            this.graphics.drawRect(0, 0, this.width, this.height);
            this.graphics.endFill();

            this.touchEnabled = true;

            this.addFocusListeners();
        }

        private addFocusListeners():void {
            this.stageText.removeEventListener("blur", this.onBlurHandler, this);
            egret.MainContext.instance.stage.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onBlurHandler, this);

            this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onMouseDownHandler, this);
        }

        private addBlurListeners():void {
            this.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onMouseDownHandler, this);

            this.stageText.addEventListener("blur", this.onBlurHandler, this);
            egret.MainContext.instance.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onBlurHandler, this);
        }

        private onBlurHandler(event):void {
            this._text.visible = true;
            this._text.text = this.stageText._getText();
            this.stageText._hide();

            this.addFocusListeners();
        }

        private onMouseDownHandler(event:TouchEvent) {
            event.stopPropagation();
            this.stageText._show();

            this._text.visible = false;

            this.addBlurListeners();
        }

        public _onRemoveFromStage():void {
            super._onRemoveFromStage();

            this.stageText._remove();

            this.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onMouseDownHandler, this);
            this.stageText.removeEventListener("blur", this.onBlurHandler, this);
            egret.MainContext.instance.stage.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onBlurHandler, this);
        }

//        public hitTest(x, y, ignoreTouchEnabled:boolean = false):DisplayObject {
//            //它不能被点击
//            return null;
//        }

        /**
         * @deprecated
         * @param value
         */
        public setText(value:string):void {
            Logger.warning("TextInput.setText()已废弃，请使用TextInput.text设置");
            this._text.text = value;
            this.stageText._setText(value);
        }

        /**
         * @deprecated
         * @returns {string}
         */
        public getText():string {
            Logger.warning("TextInput.getText()已废弃，请使用TextInput.text获取");
            return this.stageText._getText();
        }

        public set text(value:string) {
            this._text.text = value;
            this.stageText._setText(value);
        }

        public get text():string {
            return this.stageText._getText();
        }

        public setTextType(type:string):void {
            this.stageText._setTextType(type);
        }

        public getTextType():string {
            return this.stageText._getTextType();
        }


//        public _measureBounds():egret.Rectangle {
//            return egret.Rectangle.identity;
//        }

        public _updateTransform():void {
            //todo 等待worldTransform的性能优化完成，合并这块代码
            var oldTransFormA = this._worldTransform.a;
            var oldTransFormB = this._worldTransform.b;
            var oldTransFormC = this._worldTransform.c;
            var oldTransFormD = this._worldTransform.d;
            var oldTransFormTx = this._worldTransform.tx;
            var oldTransFormTy = this._worldTransform.ty;
            super._updateTransform();
            var newTransForm = this._worldTransform;
            if (oldTransFormA != newTransForm.a ||
                oldTransFormB != newTransForm.b ||
                oldTransFormC != newTransForm.c ||
                oldTransFormD != newTransForm.d ||
                oldTransFormTx != newTransForm.tx ||
                oldTransFormTy != newTransForm.ty) {
                var point = this.localToGlobal();
                this.stageText.changePosition(point.x, point.y);
                this.stageText.changeSize(this._explicitWidth, this._explicitHeight);
            }
        }

        /**
         * 字号
         * @member {number} egret.TextField#size
         */
        public _size:number = 30;

        public get size():number {
            return this._size;
        }

        public set size(value:number) {
            if (this._size != value) {
                this._size = value;
                this._text.size = value;
                this.stageText.setSize(this._size);
            }
        }

        public _textColorString:string = "#FFFFFF";

        private _textColor:number = 0xFFFFFF;
        /**
         * 文字颜色
         * @member {number} egret.TextField#textColor
         */
        public get textColor():number {
            return this._textColor;
        }

        public set textColor(value:number) {
            if (this._textColor != value) {
                this._textColor = value;
                this._textColorString = toColorString(value);
                this._text.textColor = value;
                this.stageText.setTextColor(this._textColorString);
            }
        }

        /**
         * 字体
         * @member {any} egret.TextField#fontFamily
         */
        public _fontFamily = "Arial";

        public get fontFamily():string {
            return this._fontFamily;
        }

        public set fontFamily(value:string) {
            this._setFontFamily(value);
        }

        public _setFontFamily(value:string):void {
            if (this._fontFamily != value) {
                this._fontFamily = value;
                this.stageText.setTextFontFamily(value);
            }
        }

        public _setWidth(value:number):void {
            this._text.width = value;
            this.stageText.setWidth(value);

            super._setWidth(value);
        }

        public _setHeight(value:number):void {
            this._text.height = value;
            this.stageText.setHeight(value);

            super._setHeight(value);
        }
    }
}