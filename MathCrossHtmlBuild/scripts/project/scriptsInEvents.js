// noinspection ES6UnusedImports
import Vector from "./Vector.js";
import { scene, prefs, gradientPresets, spritePresets, audioPresets, animationPresets, valuePresets, boolPresets, settings, levels, loadGame, loadOut, refreshTheme, loadLevelEdit } from "./Main.js";
import { storeUrl } from "./Settings.js";
import { colorPresets } from "./Main.js";
import { lerp, clamp, rand } from './Utils.js';
import { playSoundIfCan, findObjectOfType } from './utils/game_utils.js';
import { sendEvent } from "./event_handler.js";
import MainScene from "./MainScene.js";
import GameManager from "./GameManager.js";
import Animator from "./Animator.js";
import AdsManager from "./adsmanager/ads_manager.js";
import { animation, animationSeries } from "./animation_utils.js";



const scriptsInEvents = {

	async Egame_Event1_Act8(runtime, localVars)
	{
		runtime.globalVars.StoreUrl = settings.storeUrl;
	},

	async Egame_Event1_Act11(runtime, localVars)
	{
		const btn = runtime.objects.EditLevel.getFirstInstance();
		
		btn.isVisible = btn.isVisible && settings.development;
	},

	async Egame_Event7_Act7(runtime, localVars)
	{
		
	},

	async Egame_Event17_Act1(runtime, localVars)
	{
		runtime.globalVars.HintLeft = MainScene.hintLeft;
	},

	async Egame_Event17_Act2(runtime, localVars)
	{
		const hasVideoAds = AdsManager.instance.isRewardedAvailable();
		
		
		const hintBtn = runtime.objects.hint_btn.getFirstInstance();
		
		const skipBtn = runtime.objects.skip_btn.getFirstInstance();
		
		
		hintBtn.instVars.intractable = ( !hintBtn.instVars.WaitForReward) || ( hintBtn.instVars.WaitForReward &&  hasVideoAds);
		
		
		skipBtn.instVars.intractable = (!skipBtn.instVars.WaitForReward) ||(skipBtn.instVars.WaitForReward &&  hasVideoAds);
		
	},

	async Egame_Event17_Act3(runtime, localVars)
	{
		const buttons = [...runtime.objects.Buttons.instances()];
		
		buttons.filter(btn=> btn.originalOpacity === undefined).forEach(btn=>btn.originalOpacity = btn.opacity);
		
		buttons.forEach(btn=>btn.opacity = btn.instVars.intractable ? btn.originalOpacity : btn.originalOpacity - 0.5);
		
		
		
	},

	async Egame_Event18_Act1(runtime, localVars)
	{
		const btn = runtime.objects.hint_btn.getFirstInstance();
		// console.log(btn);
		const adsEffect = [...btn.children()].find(c=>c.objectType.name==="btn_ads_bg");
		
		adsEffect.visible = true ;
	},

	async Egame_Event32_Act3(runtime, localVars)
	{
		const backBtn = findObjectOfType(runtime,'LevelBackButton');
		const forwardBtn = findObjectOfType(runtime,'LevelForwardButton');
		
		const level = runtime.globalVars.Level;
		
		backBtn.instVars.intractable = level>1;
		backBtn.opacity = backBtn.instVars.intractable ? 1 : 0.3;
		forwardBtn.instVars.intractable = level< Math.min(levels().length,MainScene.completedLevel+1);
		forwardBtn.opacity = forwardBtn.instVars.intractable ? 1 : 0.3;
		
	},

	async Egame_Event33_Act1(runtime, localVars)
	{
		// [...runtime.objects.ShapeBreakEffect.instances()].forEach(a=>a.update(runtime.dt));
	},

	async Egame_Event34_Act2(runtime, localVars)
	{
		const box = runtime.getInstanceByUid(+runtime.globalVars.Temp);
		box.onPointerDown();
	},

	async Egame_Event36_Act1(runtime, localVars)
	{
		if(!testHints)
		return;
		
		runtime.objects.Board.getFirstInstance().hintController.showHint();
	},

	async Egame_Event40_Act2(runtime, localVars)
	{
		const e = runtime.getInstanceByUid(+runtime.globalVars.Temp).data;
		const board = runtime.objects.Board.getFirstInstance();
		
		const tile = board.getTile(e.coordinate);
		runtime.callFunction("CreateScoreEffect",e.score,tile.x,tile.y);
		
	},

	async Egame_Event41_Act1(runtime, localVars)
	{
		const points = localVars.Points;
		console.log(points);
		const effect =runtime.objects.ScorePoints.createInstance("GameUI",localVars.X,localVars.Y);
		effect.text.text ="+" +points;
		
		
		const animator = runtime.objects.Animator.createInstance(0,0,0);
		
		const intermidateScale = 1.1;
		const startScale = 0;
		const normalWidth = effect.width;
		const normalHeight = effect.height;
		let startY = effect.y;
		
		const offset = 120;
		
		await animator.linearAnim(10,n=> {
		const scale = lerp(startScale,intermidateScale,n);
		effect.width = normalWidth*scale;
		effect.height = normalHeight*scale;
		
		effect.y = lerp(startY,startY-offset,n);
		});
		
		await animator.linearAnim(15,n=> {
		const scale = lerp(intermidateScale,1,n);
		effect.width = normalWidth*scale;
		effect.height = normalHeight*scale;
		
		});
		
		
		await animator.delay(0.1);
		const endScale = 0.4;
		
		startY = effect.y;
		const startX = effect.x;
		
		const target = runtime.objects.ScoreTxt.getFirstInstance();
		await animator.lerpAnim(6.5,0,1.5,n=>{
			effect.x = lerp(startX,target.x,n);
			effect.y = lerp(startY,target.y,n);
			
			const scale = lerp(1,endScale,n);
		effect.width = normalWidth*scale;
		effect.height = normalHeight*scale;
		});
		
		animator.destroy();
		effect.destroy();
		
		runtime.objects.ScoreTxt.getFirstInstance().addPoints(points);
	},

	async Egame_Event42_Act1(runtime, localVars)
	{
		const scoreText = runtime.objects.ScoreTxt.getFirstInstance();
		
		const normalWidth = scoreText.width;
		const normalHeight = scoreText.height;
		const normalFontSize = scoreText.sizePt;
		const intermidateScale = 1.1;
		
		const animator = runtime.objects.Animator.createInstance(0,0,0);
		
		
		await animator.linearAnim(10,n=> {
		const scale = lerp(1,intermidateScale,n);
		scoreText.width = normalWidth*scale;
		scoreText.height = normalHeight*scale;
		scoreText.sizePt = normalFontSize*scale;
		
		});
		scoreText.text = runtime.globalVars.Score+"";
		await animator.linearAnim(10,n=> {
		const scale = lerp(intermidateScale,1,n);
		scoreText.width = normalWidth*scale;
		scoreText.height = normalHeight*scale;
		scoreText.sizePt = normalFontSize*scale;
		
		});
		
		
		animator.destroy();
	},

	async Egame_Event44_Act1(runtime, localVars)
	{
		
		const box = runtime.objects.ToastBox.createInstance(1,runtime.layout.width*1.5,runtime.layout.height/2 - 300,true);
		box.message = localVars.Message;
		await runtime.callFunction('ToastAnimation',box.uid);
	},

	async Egame_Event46_Act1(runtime, localVars)
	{
		const effect = runtime.objects.ToastEffect.createInstance("GameUI", runtime.layout.width*1.5,runtime.layout.height/2 - 300,true);
		// const animator = Animator.create(runtime);
		// await animator.delayFrame();
		// animator.destroy();
		effect.text.text = localVars.Message;
		console.log("Message:"+localVars.Message);
		effect.image.setAnimation(rand(0,4)+"");
		await runtime.callFunction('ToastAnimation',effect.uid);
	},

	async Egame_Event47_Act1(runtime, localVars)
	{
		const bg = runtime.objects.effectbg.getFirstInstance();
		bg.isVisible = true;
		const effect = runtime.getInstanceByUid(localVars.UID);
		
		const width = effect.width;
		const height = effect.height;
		
		
		const animator = runtime.objects.Animator.createInstance(0,0,0);
		
		const startX = effect.x;
		const midX  = runtime.layout.width/2;
		const endX = -(startX - runtime.layout.width/2) + runtime.layout.width/2;
		const endScale = 1.5;
		
		await animator.lerpAnim(15,0,1.2,n=> {
		effect.x = lerp(startX,midX,n);
		effect.width = width*lerp(endScale,1,n);
		effect.height = height*lerp(endScale,1,n);
		
		
		}).asPromise(animator);
		await animator.delay(1).asPromise(animator);
		await animator.lerpAnim(15,0,1.2,n=>{
		effect.x = lerp(midX,endX,n);
		effect.width = width*lerp(1,endScale,n);
		effect.height = height*lerp(1,endScale,n);
		
		}
		).asPromise(animator);
		animator.destroy();
		effect.destroy();
		bg.isVisible = false;
	},

	async Egame_Event48_Act2(runtime, localVars)
	{
		const img = runtime.getInstanceByUid(+runtime.globalVars.Temp);
		
		if(colorPresets[img.instVars.ColorPreset])
		img.color = colorPresets[img.instVars.ColorPreset] ?? img.color;
		console.log(img,colorPresets[img.instVars.ColorPreset]);
	},

	async Egame_Event49_Act2(runtime, localVars)
	{
		const img = runtime.getInstanceByUid(+runtime.globalVars.Temp);
		img.color = colorPresets[img.instVars.ColorPreset] ?? img.color;
	},

	async Egame_Event57_Act1(runtime, localVars)
	{
		const result = await AdsManager.instance.showRewarded();
		console.log('hint result:'+result);
		if(result)
		MainScene.hintLeft += valuePresets["HINT_REWARD_FOR_ADS"]
	},

	async Egame_Event63_Act1(runtime, localVars)
	{
		const result = await AdsManager.instance.showRewarded();
		console.log('skip result:'+result);
		if(result)
		scene.skip();
	},

	async Egame_Event64_Act1(runtime, localVars)
	{
		scene.skip();
	},

	async Egame_Event66_Act1(runtime, localVars)
	{
		loadLevelEdit(runtime,{level:runtime.globalVars.Level});
	},

	async Egame_Event67_Act1(runtime, localVars)
	{
		scene.loadLevel(localVars.Target);
	},

	async Egame_Event68_Act1(runtime, localVars)
	{
		scene.showHint();
	},

	async Boardscroll_Event7_Act1(runtime, localVars)
	{
		const board = runtime.objects.Board.getFirstInstance();
		const content = runtime.objects.BoardContent.getFirstInstance();
		const scrollableLength = Math.max(content.height - board.height + content.instVars.Padding*2,0);
		const padding = content.instVars.Padding;
		
		console.log(localVars.Normalized);
		content.y = board.y + padding - scrollableLength* clamp(localVars.Normalized,0,1);
	},

	async Boardscroll_Event8_Act1(runtime, localVars)
	{
		
		const board = runtime.objects.Board.getFirstInstance();
		const content = runtime.objects.BoardContent.getFirstInstance();
		const padding = content.instVars.Padding;
		const scrollableLength = content.height - board.height + content.instVars.Padding*2;
		const scrolledLength = board.y + padding - content.y;
		
		runtime.globalVars.ScrollNormalized = (scrollableLength <= 0 ? 0 : scrolledLength/scrollableLength);
	},

	async Global_Event2_Act1(runtime, localVars)
	{
		
		const content = runtime.getInstanceByUid(localVars.ObjectId);
		
		const start = localVars.Start;
		const end = localVars.End;
		const intermidateN = localVars.IntermidateN;
		const speed = localVars.Speed;
		const property = localVars.Property;
		
		
		const intermidate = (end - start)*(1+localVars.IntermidateOffset) + start;
		
		
		const animator = runtime.objects.Animator.createInstance(0,0,0);
		await animator.lerpAnim(speed,0,localVars.NormalizedEnd,n=>{
		
			content[property] =  n< intermidateN ? lerp(start,intermidate,n/intermidateN):lerp(intermidate,end,(n-intermidateN)/(1-intermidateN));
			
		// 	console.log("animate :"+ content[localVars.Property])
		});
		animator.destroy();
		
	},

	async Global_Event3_Act1(runtime, localVars)
	{
		
		const content = runtime.getInstanceByUid(localVars.ObjectId);
		const isX = localVars.X;
		const defaultSide = localVars.DefaultSide;
		
		const start = isX? (defaultSide? content.x - runtime.layout.width : content.x + runtime.layout.width):
		(defaultSide? content.y - runtime.layout.height : content.y + runtime.layout.height);
		const end =  isX? content.x : content.y;
		
		const intermidateOffset = localVars.IntermidateOffset ? +localVars.IntermidateOffset : 0.05;
		
		const intermidateN = localVars.IntermidateN ? +localVars.IntermidateN : 0.9;
		
		const speed = localVars.Speed ? +localVars.Speed : 6;
		
		const normalizedEnd = localVars.NormalizedEnd ? +localVars.NormalizedEnd : 1.2;
		
		await runtime.callFunction("AnimateFloat",content.uid,isX? "x":"y",start,end,intermidateOffset,intermidateN,speed,normalizedEnd);
		
	},

	async Global_Event4_Act1(runtime, localVars)
	{
		
		const content = runtime.getInstanceByUid(localVars.ObjectId);
		const scaleUp = localVars.ScaleUp;
		const minScale = localVars.MinScale ? +localVars.MinScale : 0.6;
		
		const start = scaleUp ? minScale : 1;
		const end =  scaleUp? 1 : minScale;
		
		const intermidateOffset = localVars.IntermidateOffset ? +localVars.IntermidateOffset : 0.05;
		
		const intermidateN = localVars.IntermidateN ? +localVars.IntermidateN : 0.9;
		
		const speed = localVars.Speed ? +localVars.Speed : 6;
		
		const normalizedEnd = localVars.NormalizedEnd ? +localVars.NormalizedEnd : 1.2;
		
		 runtime.callFunction("AnimateFloat",content.uid,"width",start*content.width,end*content.width,intermidateOffset,scaleUp? intermidateN : 1 - intermidateN,speed,normalizedEnd);
		
		await runtime.callFunction("AnimateFloat",content.uid,"height",start*content.height,end*content.height,intermidateOffset,scaleUp? intermidateN : 1 - intermidateN,speed,normalizedEnd);
		
	},

	async Global_Event5_Act1(runtime, localVars)
	{
		const tile = runtime.getInstanceByUid(localVars.ObjectId);
		
		const animator = runtime.objects.Animator.createInstance(0,0,0);
		
		const normalWidth = tile.width;
		const normalHeight = tile.height;
		
		const normalizedEnd = localVars.NormalizedEnd ? +localVars.NormalizedEnd : 1.2;
		const intermidateN = localVars.IntermidateN ? +localVars.IntermidateN : 0.3;
		const intermidateScale = localVars.MaxScale ? +localVars.MaxScale : 1.1;
		
		const speed = localVars.Speed ? +localVars.Speed : 10;
		
		await animator.lerpAnim(speed,0,normalizedEnd,n=>{
			const scale =  intermidateN>=n ? lerp(1,intermidateScale,n/intermidateN) : lerp(intermidateScale,1,(n-intermidateN)/(1-intermidateN));
			tile.width = normalWidth*scale;
			tile.height = normalHeight*scale;
		});
		animator.destroy();
	},

	async Global_Event6_Act1(runtime, localVars)
	{
		[...runtime.objects.Animator.instances()].forEach(a=>a.update());
	},

	async Global_Event7(runtime, localVars)
	{
		
	},

	async Global_Event11_Act1(runtime, localVars)
	{
		if(scene) scene.onLayoutEnded();
	},

	async Global_Event13_Act2(runtime, localVars)
	{
		const item = runtime.getInstanceByUid(+runtime.globalVars.Temp);
		item.setAnimation(spritePresets[item.instVars.SpritePreset] ?? item.animationName);
	},

	async Global_Event19_Act2(runtime, localVars)
	{
		console.log("Play Sound:"+ runtime.globalVars.Temp1);
	},

	async Global_Event21_Act2(runtime, localVars)
	{
		localVars.LayerCount = [...runtime.layout.allLayers()].length;
	},

	async Global_Event22_Act2(runtime, localVars)
	{
		localVars.LayerName = runtime.layout.getLayer(+runtime.globalVars.Temp2).name;
	},

	async Global_Event26_Act1(runtime, localVars)
	{
		runtime.globalVars.Temp = audioPresets[localVars.Name] ?? "";
	},

	async Global_Event27_Act1(runtime, localVars)
	{
		runtime.globalVars.Temp = valuePresets[localVars.Name] ?? "";
	},

	async Global_Event28_Act1(runtime, localVars)
	{
		runtime.globalVars.Temp = (boolPresets[localVars.Name] ?? true)+"";
		console.log("bool preset:"+localVars.Name+":"+runtime.globalVars.Temp);
	},

	async Global_Event29_Act1(runtime, localVars)
	{
		runtime.globalVars.Temp = JSON.stringify(animationPresets[localVars.Name]) ?? "";
	},

	async Global_Event30_Act1(runtime, localVars)
	{
		const anim = animationPresets[localVars.Name];
		console.log('preset',anim);
		
		if(!anim) return;
		console.log('apply_animation:');
		
		const instance = runtime.getInstanceByUid(localVars.UID);
		
		const com = Animator.create(runtime).blankComponent ;
		console.log('apply_animation_preset_1',instance.animators);
		instance.animators = instance.animators ?? [];
		
		instance.animators.push(com);
		console.log('apply_animation_preset_2',instance.animators);
		await animation(com,instance,anim).asPromise();
		
		console.log('finish_apply_animation:'+runtime.gameTime,instance.animators.length);
		instance.animators.remove(com);
		com.gameObject.destroy();
	},

	async Global_Event31_Act1(runtime, localVars)
	{
		const layout = localVars.Layout;
		await loadOut(runtime,()=>{
		console.log('layout:',localVars);
		runtime.goToLayout(layout);
		})
	},

	async Global_Event33_Act6(runtime, localVars)
	{
		console.log("presets",animationPresets);
	},

	async Global_Event37_Act1(runtime, localVars)
	{
		const layer = runtime.layout.getLayer("Development");
		const edit = runtime.objects.edit_btn.getFirstInstance();
		
		const leftTop = layer.cssPxToLayer(0,0);
		const bottomRight = layer.cssPxToLayer(window.innerWidth,window.innerHeight);
		
		// console.log('left top',leftTop,'bottom right',bottomRight,clamp(edit.x,leftTop[0]+edit.width*0.9,bottomRight[0] - edit.width*0.5));
		
		edit.x = clamp(edit.x,leftTop[0]+edit.width*0.5,bottomRight[0] - edit.width*0.5);
		
		
		
		edit.y = clamp(edit.y,leftTop[1]+edit.height*0.5,bottomRight[1] - edit.height*0.5 );
		
		
		
		
		
		
	},

	async Global_Event38_Act1(runtime, localVars)
	{
		
		const edit = runtime.objects.edit_btn.getFirstInstance();
		
		if(edit.snipping)
		return;
		
		
		runtime.callFunction("SnapToNearestEdge");
		
		
	},

	async Global_Event40_Act1(runtime, localVars)
	{
		const layer = runtime.layout.getLayer("Development");
		const edit = runtime.objects.edit_btn.getFirstInstance();
		
		if(edit.snipping) return;
		
		edit.snipping = true;
		
		const leftTop = layer.cssPxToLayer(0,0);
		const bottomRight = layer.cssPxToLayer(window.innerWidth,window.innerHeight);
		
		const edges = [
		{value:Math.abs(leftTop[0]-edit.x)}
		// ,{value:Math.abs(leftTop[1] - edit.y)}
		,{value:Math.abs(bottomRight[0] - edit.x)}
		// ,{value:Math.abs(bottomRight[1] - edit.y)}
		];
		console.log('min item',edges.minItem(i=>i.value),edges,leftTop,bottomRight,leftTop.x-edit.x)
		const snipping = edges.indexOf(edges.minItem(i=>i.value));
		
		const targetX = snipping === 0 ? leftTop[0] + edit.width/2 : snipping ===1 ? bottomRight[0] - edit.width/2 : edit.x;
		
		
		const targetY = edit.y;//snipping === 1 ? leftTop[1] + edit.height/2 : snipping === 3 ? bottomRight[1] - edit.height/2 : edit.y;
		
		const start = {x:edit.x,y:edit.y};
		
		const animator = Animator.create(runtime);
		animator.tweenAnim({curve:"EASE_IN",time:0.05},n=>{
		console.log(n);
			edit.x = lerp(start.x,targetX,n);
			edit.y = lerp(start.y,targetY,n);
		},()=>{
		edit.snipping = false;
		animator.destroy();
		});
		
		
		
		
		
	},

	async Global_Event42_Act1(runtime, localVars)
	{
		const themeContent = runtime.objects.ThemeContent.getFirstInstance();
		
		const startY = themeContent.y  + 350;
		const sampleTile = runtime.objects.theme_tile.getFirstInstance();
		
		for(let i=0;i<settings.themes.length;i++)
		{
			const tile = runtime.objects.theme_tile.createInstance(themeContent.layer.index, themeContent.x + themeContent.width/2, startY + (sampleTile.height + 20)*i,true);
			tile.getChildByName('Text').text = settings.themes[i];
		}
		
		
		
	},

	async Global_Event42_Act3(runtime, localVars)
	{
		runtime.layout.getLayer("Development").isVisible = settings.development;
	},

	async Global_Event44_Act2(runtime, localVars)
	{
		await prefs.setItem("theme",runtime.getInstanceByUid(+runtime.globalVars.Temp).getChildByName('Text').text);
		await prefs.save();
		location.reload();
	},

	async Global_Event48_Act1(runtime, localVars)
	{
		const anim = animationPresets[localVars.PresetName];
		
		if(!anim) return;
		
		const instances = [...runtime.objects[localVars.FamilyName].instances()]
		.filter(obj=> obj.isVisible).sort((a,b)=>a.x - b.x);
		
		const animator = Animator.create(runtime);
		
		console.log('animation_series',instances,anim);
		
		 const token = {cancel: false};
		 await animator.blankComponent.startCoroutine(animationSeries(animator.blankComponent, instances, anim.animation, anim.delay, instances.map(_=>{return {};}), token,anim.reverse,anim.start,anim.end), () => {
		        }, token).asPromise();
		
		
	},

	async Global_Event49_Act1(runtime, localVars)
	{
		[...runtime.objects[localVars.Family].instances()].filter(obj=>obj.layer.name === localVars.Layer).forEach(obj=>obj.translate = new Vector(-2000,-2000));
	},

	async Global_Event55_Act1(runtime, localVars)
	{
		const panel = runtime.getInstanceByUid(localVars.UID);
		console.log('hide_panel',panel);
		panel.animators = panel.animators || [];
		panel.animators.forEach(a=>{
		a.stopAllCoroutines();
		console.log('destroying animator',a);
		a.gameObject.destroy();});
		panel.animators = [];
		
	},

	async Global_Event56_Act2(runtime, localVars)
	{
		const bg = runtime.objects.background.getFirstInstance();
		
		if(!bg) return;
		const fit = bg.getComponent('ImageFit');
		
		if(!fit) return;
		
		console.log('bg_components',bg);
		fit.type = bg.animationName === 'Default' ? "no-aspect" : 'fill';
	},

	async Esplash_Event1_Act2(runtime, localVars)
	{
		      if (boolPresets['TUTORIAL_FIRST_TIME'] && !prefs.getItem('tutorialCompleted', false)) {
		                runtime.goToLayout('Tutorial');
		                prefs.setItem('tutorialCompleted', true);
		            }
					else
					{
					 runtime.goToLayout('Game');
					}
					
		
	},

	async Eeditor_Event2_Act1(runtime, localVars)
	{
		console.log([...runtime.objects.TextInput.instances()]);
	},

	async Emobileads_Event14_Act4(runtime, localVars)
	{
		console.log('ads: '+ runtime.globalVars.Temp);
		sendEvent(runtime,"REWARDED_RESULT",runtime.globalVars.Temp);
	},

	async Emobileads_Event15_Act1(runtime, localVars)
	{
		sendEvent(runtime,"ADMOB_CONFIGURATION_COMPLETE");
	},

	async Emobileads_Event16_Act1(runtime, localVars)
	{
		console.log("ads: interstitial ads loaded internal");
	},

	async Emobileads_Event17_Act2(runtime, localVars)
	{
		console.log("ads: interstitial ads falied to load internal :" + runtime.globalVars.Temp);
	},

	async Emobileads_Event19_Act1(runtime, localVars)
	{
		return AdsManager.instance.isRewardedAvailable();
	},

	async Emobileads_Event20_Act1(runtime, localVars)
	{
		return AdsManager.instance.isInterstitialAvailable();
	},

	async Emobileads_Event21_Act1(runtime, localVars)
	{
		AdsManager.instance.passInterstitialIfCan();
	},

	async Emobileads_Event22_Act1(runtime, localVars)
	{
		runtime.globalVars.RewardedResult = await AdsManager.instance.showRewarded();
	},

	async Emobileads_Event23_Act1(runtime, localVars)
	{
		AdsManager.instance.showInterstitial();
	},

	async Emobileads_Event24_Act1(runtime, localVars)
	{
		AdsManager.instance.showOrPassInterstitialIfCan();
	},

	async Eplatforminfo_Event8_Act1(runtime, localVars)
	{
		console.log('its mobile platform');
	},

	async Eplatforminfo_Event9_Act1(runtime, localVars)
	{
		console.log('its not mobile platform');
	}

};

self.C3.ScriptsInEvents = scriptsInEvents;

