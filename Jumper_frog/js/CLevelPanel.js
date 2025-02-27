function CLevelPanel(iCurLevel){
    
    var _oBg;
    var _oGroup;
    var _oMsgText;
    var _oScoreText;
    
    this._init = function(){
        
        _oBg = createBitmap(s_oSpriteLibrary.getSprite('msg_box'));
        _oBg.x = 0;
        _oBg.y = 0;


        _oGroup = new createjs.Container();
        _oGroup.alpha = 0;
        _oGroup.visible=false;
        _oGroup.addChild(_oBg);

        var iWidth = 500;
        var iHeight = 70;
        var iTextX = CANVAS_WIDTH/2;
        var iTextY = (CANVAS_HEIGHT/2)-164;
        _oMsgText = new CTLText(_oGroup, 
                    iTextX -iWidth/2, iTextY - iHeight/2, iWidth, iHeight, 
                    60, "center", "#fcff00", PRIMARY_FONT, 1.2,
                    2, 2,
                    " ",
                    true, true, false,
                    false );
        _oMsgText.setShadow("#000",4,4,5);

        var iWidth = 500;
        var iHeight = 50;
        var iTextX = CANVAS_WIDTH/2;
        var iTextY = (CANVAS_HEIGHT/2)+50;
        _oScoreText = new CTLText(_oGroup, 
                    iTextX -iWidth/2, iTextY - iHeight/2, iWidth, iHeight, 
                    40, "center", "#fcff00", PRIMARY_FONT, 1.2,
                    2, 2,
                    " ",
                    true, true, false,
                    false );
        _oScoreText.setShadow("#000",4,4,5);
        
        s_oStage.addChild(_oGroup);
    };
    
    this.unload = function(){
        _oGroup.removeAllEventListeners();
    };
    
    this._initListener = function(){
        _oGroup.on("mousedown",this._onExit);
    };
    
    this.show = function(iScore){
        playSound("win_level",1,false);

        var oParent = this;
        oParent._initListener();

        _oMsgText.refreshText( sprintf(TEXT_LEVELEND, iCurLevel) );
        _oScoreText.refreshText( TEXT_SCORE +" "+iScore );
        
        _oGroup.visible = true;
        
        
        createjs.Tween.get(_oGroup).to({alpha:1 }, 500);
        document.dispatchEvent(new CustomEvent("save_score", {detail: { score: iScore } }));
    };
    
    this._onExit = function(){
        _oGroup.removeAllEventListeners();
        s_oStage.removeChild(_oGroup);
        
        s_oGame.reset();
    };
    
    this._init(iCurLevel);
    
    return this;
}
