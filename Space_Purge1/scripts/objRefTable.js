const C3 = self.C3;
self.C3_GetObjectRefTable = function () {
	return [
		C3.Plugins.Sprite,
		C3.Behaviors.Rotate,
		C3.Behaviors.Sin,
		C3.Behaviors.Flash,
		C3.Behaviors.solid,
		C3.Behaviors.Bullet,
		C3.Plugins.Audio,
		C3.Plugins.Browser,
		C3.Plugins.Keyboard,
		C3.Plugins.Mouse,
		C3.Plugins.Touch,
		C3.Plugins.LocalStorage,
		C3.Behaviors.Fade,
		C3.Behaviors.bound,
		C3.Behaviors.DragnDrop,
		C3.Plugins.Spritefont2,
		C3.Plugins.System.Cnds.OnLayoutStart,
		C3.Plugins.Sprite.Acts.Destroy,
		C3.Plugins.System.Acts.SetVar,
		C3.Plugins.System.Acts.SetGroupActive,
		C3.Plugins.System.Cnds.Every,
		C3.Plugins.System.Cnds.CompareVar,
		C3.Plugins.Audio.Acts.Play,
		C3.Plugins.Sprite.Cnds.OnAnimFinished,
		C3.Plugins.System.Cnds.EveryTick,
		C3.Plugins.Spritefont2.Acts.SetText,
		C3.Plugins.Sprite.Acts.SetY,
		C3.Plugins.Sprite.Exps.Y,
		C3.Plugins.Sprite.Acts.SetPos,
		C3.Plugins.Sprite.Exps.X,
		C3.Plugins.Sprite.Acts.SetPosToObject,
		C3.Plugins.Sprite.Acts.SetX,
		C3.Plugins.Sprite.Acts.SetAngle,
		C3.Plugins.Sprite.Exps.Angle,
		C3.Plugins.Sprite.Acts.SetAnimFrame,
		C3.Plugins.System.Cnds.IsGroupActive,
		C3.Plugins.Sprite.Acts.Spawn,
		C3.Plugins.LocalStorage.Acts.SetItem,
		C3.Plugins.System.Exps.projectname,
		C3.Plugins.Sprite.Cnds.OnCollision,
		C3.Plugins.System.Exps.random,
		C3.Plugins.System.Acts.CreateObject,
		C3.Plugins.Sprite.Cnds.OnCreated,
		C3.Plugins.Sprite.Acts.SetInstanceVar,
		C3.Plugins.Sprite.Cnds.CompareFrame,
		C3.Plugins.System.Acts.AddVar,
		C3.Behaviors.Flash.Acts.Flash,
		C3.Plugins.System.Acts.SubVar,
		C3.Plugins.System.Acts.Wait,
		C3.Behaviors.Fade.Acts.StartFade,
		C3.Plugins.Touch.Cnds.IsTouchingObject,
		C3.Behaviors.Sin.Acts.SetEnabled,
		C3.Behaviors.Sin.Acts.SetPeriod,
		C3.Behaviors.Sin.Acts.SetMagnitude,
		C3.Plugins.Sprite.Cnds.OnAnyAnimFinished,
		C3.Plugins.System.Acts.GoToLayout,
		C3.Plugins.Sprite.Acts.SetVisible,
		C3.Plugins.Spritefont2.Acts.SetVisible,
		C3.Behaviors.Fade.Acts.RestartFade,
		C3.Plugins.System.Exps.loadingprogress,
		C3.Plugins.System.Cnds.OnLoadFinished,
		C3.Plugins.Audio.Acts.Preload,
		C3.Plugins.System.Acts.SetLayerVisible,
		C3.Behaviors.Bullet.Acts.SetSpeed,
		C3.Plugins.LocalStorage.Acts.CheckItemExists,
		C3.Plugins.Spritefont2.Cnds.CompareInstanceVar,
		C3.Plugins.LocalStorage.Cnds.OnItemExists,
		C3.Plugins.LocalStorage.Exps.ItemValue,
		C3.Plugins.LocalStorage.Cnds.OnItemMissing,
		C3.Plugins.Audio.Acts.SetVolume,
		C3.Plugins.Touch.Cnds.OnTouchObject,
		C3.Plugins.System.Cnds.Else,
		C3.Plugins.System.Acts.WaitForSignal,
		C3.Plugins.System.Acts.RestartLayout,
		C3.Plugins.Sprite.Acts.StartAnim,
		C3.Plugins.Browser.Acts.GoToURL,
		C3.Plugins.Mouse.Cnds.IsButtonDown,
		C3.Plugins.Mouse.Acts.SetCursorSprite,
		C3.Plugins.Mouse.Cnds.IsOverObject,
		C3.Plugins.Sprite.Acts.SetSize,
		C3.Plugins.Browser.Acts.RequestFullScreen,
		C3.Plugins.Browser.Acts.CancelFullScreen,
		C3.Plugins.Sprite.Acts.SetAnim,
		C3.Plugins.System.Acts.SetLayerOpacity,
		C3.Plugins.System.Cnds.LayerCmpOpacity,
		C3.Plugins.System.Exps.layeropacity,
		C3.Plugins.System.Acts.Signal,
		C3.Plugins.Browser.Acts.GoToURLWindow
	];
};
self.C3_JsPropNameTable = [
	{BtnMenu: 0},
	{BtnInfo: 0},
	{BtnMoreGames: 0},
	{Button_Music: 0},
	{BtnGo: 0},
	{BtnRestart: 0},
	{Button_Sound: 0},
	{Cursor: 0},
	{CursorHover: 0},
	{Rotate: 0},
	{SunLight: 0},
	{Sine: 0},
	{BtnFullscreen: 0},
	{BtnSettings: 0},
	{FramePaused: 0},
	{BtnReturn: 0},
	{GameOver: 0},
	{GameLogo: 0},
	{FrameLevelUp: 0},
	{LevelUp: 0},
	{Paused: 0},
	{BtnPlay: 0},
	{FlashGui: 0},
	{EarthGui: 0},
	{SpaceshipGui: 0},
	{SpaceshipTrailGui: 0},
	{BtnHome: 0},
	{BtnClassmates: 0},
	{BtnFacebook: 0},
	{BtnGooglePlus: 0},
	{BtnInContact: 0},
	{BtnTwitter: 0},
	{BtnStart: 0},
	{StartFrames: 0},
	{Flash: 0},
	{Backgrounds: 0},
	{Earth: 0},
	{BackgroundEarth: 0},
	{Smoke: 0},
	{SpaceshipMenu: 0},
	{SpaceshipTrailMenu: 0},
	{GameIcon: 0},
	{Frame: 0},
	{Solid: 0},
	{FrameCollision: 0},
	{Bullet: 0},
	{AsteroidsMenu: 0},
	{PlanetsMenu: 0},
	{Frame_2: 0},
	{Audio: 0},
	{Browser: 0},
	{Keyboard: 0},
	{Mouse: 0},
	{Touch: 0},
	{LocalStorage: 0},
	{Explosion_1: 0},
	{Explosion_2: 0},
	{Explosion_3: 0},
	{Explosion_4: 0},
	{ShieldEffect: 0},
	{LifeEffect: 0},
	{RocketEffect: 0},
	{UpdateEffect: 0},
	{Fade: 0},
	{FrameSheild: 0},
	{Bonus500Effect: 0},
	{Bonus1000Effect: 0},
	{Bonus2000Effect: 0},
	{Explosion_5: 0},
	{Explosion_6: 0},
	{Score_10: 0},
	{Score_100: 0},
	{Score_20: 0},
	{Score_50: 0},
	{BoundToLayout: 0},
	{Spaceship: 0},
	{SpaceshipTrail: 0},
	{Speed: 0},
	{Asteroids: 0},
	{Planets: 0},
	{Collision: 0},
	{Laser: 0},
	{Shield: 0},
	{Life: 0},
	{Rocket: 0},
	{Update: 0},
	{LaserTrail: 0},
	{Bonus1000: 0},
	{Bonus2000: 0},
	{Bonus500: 0},
	{DragDrop: 0},
	{SpaceshipTouch: 0},
	{LastScoreFont: 0},
	{AmmoFont: 0},
	{BestScoreFont: 0},
	{LevelFont: 0},
	{ScoreFont: 0},
	{FpsFont: 0},
	{GameOverFont: 0},
	{TextFont: 0},
	{AmmoBonusFont: 0},
	{EarthLifeFont: 0},
	{SpaceshipLifeFont: 0},
	{LoadingFont: 0},
	{ID: 0},
	{InfoFont: 0},
	{GameInfoFont: 0},
	{LevelInfoFont: 0},
	{ButtonsSound: 0},
	{Buttons_2Sound: 0},
	{Scores: 0},
	{Level: 0},
	{Score: 0},
	{Ammo: 0},
	{EarthLife: 0},
	{LastScore: 0},
	{BestScore: 0},
	{LevelSpeed: 0},
	{Demolished: 0},
	{LauncherType: 0},
	{SpaceshipsLife: 0},
	{SpaceshipShell: 0},
	{Pause: 0},
	{Fullscreen: 0},
	{Sound: 0},
	{Sound_Status: 0},
	{Music: 0},
	{Music_Status: 0},
	{GAME_NAME: 0},
	{DESCRIPTION: 0},
	{REDIRECT_URL: 0},
	{IMAGE: 0}
];

self.InstanceType = {
	BtnMenu: class extends self.ISpriteInstance {},
	BtnInfo: class extends self.ISpriteInstance {},
	BtnMoreGames: class extends self.ISpriteInstance {},
	Button_Music: class extends self.ISpriteInstance {},
	BtnGo: class extends self.ISpriteInstance {},
	BtnRestart: class extends self.ISpriteInstance {},
	Button_Sound: class extends self.ISpriteInstance {},
	Cursor: class extends self.ISpriteInstance {},
	CursorHover: class extends self.ISpriteInstance {},
	SunLight: class extends self.ISpriteInstance {},
	BtnFullscreen: class extends self.ISpriteInstance {},
	BtnSettings: class extends self.ISpriteInstance {},
	FramePaused: class extends self.ISpriteInstance {},
	BtnReturn: class extends self.ISpriteInstance {},
	GameOver: class extends self.ISpriteInstance {},
	GameLogo: class extends self.ISpriteInstance {},
	FrameLevelUp: class extends self.ISpriteInstance {},
	LevelUp: class extends self.ISpriteInstance {},
	Paused: class extends self.ISpriteInstance {},
	BtnPlay: class extends self.ISpriteInstance {},
	FlashGui: class extends self.ISpriteInstance {},
	EarthGui: class extends self.ISpriteInstance {},
	SpaceshipGui: class extends self.ISpriteInstance {},
	SpaceshipTrailGui: class extends self.ISpriteInstance {},
	BtnHome: class extends self.ISpriteInstance {},
	BtnClassmates: class extends self.ISpriteInstance {},
	BtnFacebook: class extends self.ISpriteInstance {},
	BtnGooglePlus: class extends self.ISpriteInstance {},
	BtnInContact: class extends self.ISpriteInstance {},
	BtnTwitter: class extends self.ISpriteInstance {},
	BtnStart: class extends self.ISpriteInstance {},
	StartFrames: class extends self.ISpriteInstance {},
	Backgrounds: class extends self.ISpriteInstance {},
	Earth: class extends self.ISpriteInstance {},
	BackgroundEarth: class extends self.ISpriteInstance {},
	Flash: class extends self.ISpriteInstance {},
	Smoke: class extends self.ISpriteInstance {},
	SpaceshipMenu: class extends self.ISpriteInstance {},
	SpaceshipTrailMenu: class extends self.ISpriteInstance {},
	GameIcon: class extends self.ISpriteInstance {},
	Frame: class extends self.ISpriteInstance {},
	FrameCollision: class extends self.ISpriteInstance {},
	AsteroidsMenu: class extends self.ISpriteInstance {},
	PlanetsMenu: class extends self.ISpriteInstance {},
	Frame_2: class extends self.ISpriteInstance {},
	Audio: class extends self.IInstance {},
	Browser: class extends self.IInstance {},
	Keyboard: class extends self.IInstance {},
	Mouse: class extends self.IInstance {},
	Touch: class extends self.IInstance {},
	LocalStorage: class extends self.IInstance {},
	Explosion_1: class extends self.ISpriteInstance {},
	Explosion_2: class extends self.ISpriteInstance {},
	Explosion_3: class extends self.ISpriteInstance {},
	Explosion_4: class extends self.ISpriteInstance {},
	ShieldEffect: class extends self.ISpriteInstance {},
	LifeEffect: class extends self.ISpriteInstance {},
	RocketEffect: class extends self.ISpriteInstance {},
	UpdateEffect: class extends self.ISpriteInstance {},
	FrameSheild: class extends self.ISpriteInstance {},
	Bonus500Effect: class extends self.ISpriteInstance {},
	Bonus1000Effect: class extends self.ISpriteInstance {},
	Bonus2000Effect: class extends self.ISpriteInstance {},
	Explosion_5: class extends self.ISpriteInstance {},
	Explosion_6: class extends self.ISpriteInstance {},
	Score_10: class extends self.ISpriteInstance {},
	Score_100: class extends self.ISpriteInstance {},
	Score_20: class extends self.ISpriteInstance {},
	Score_50: class extends self.ISpriteInstance {},
	Spaceship: class extends self.ISpriteInstance {},
	SpaceshipTrail: class extends self.ISpriteInstance {},
	Asteroids: class extends self.ISpriteInstance {},
	Planets: class extends self.ISpriteInstance {},
	Collision: class extends self.ISpriteInstance {},
	Laser: class extends self.ISpriteInstance {},
	Shield: class extends self.ISpriteInstance {},
	Life: class extends self.ISpriteInstance {},
	Rocket: class extends self.ISpriteInstance {},
	Update: class extends self.ISpriteInstance {},
	LaserTrail: class extends self.ISpriteInstance {},
	Bonus1000: class extends self.ISpriteInstance {},
	Bonus2000: class extends self.ISpriteInstance {},
	Bonus500: class extends self.ISpriteInstance {},
	SpaceshipTouch: class extends self.ISpriteInstance {},
	LastScoreFont: class extends self.ISpriteFontInstance {},
	AmmoFont: class extends self.ISpriteFontInstance {},
	BestScoreFont: class extends self.ISpriteFontInstance {},
	LevelFont: class extends self.ISpriteFontInstance {},
	ScoreFont: class extends self.ISpriteFontInstance {},
	FpsFont: class extends self.ISpriteFontInstance {},
	GameOverFont: class extends self.ISpriteFontInstance {},
	TextFont: class extends self.ISpriteFontInstance {},
	AmmoBonusFont: class extends self.ISpriteFontInstance {},
	EarthLifeFont: class extends self.ISpriteFontInstance {},
	SpaceshipLifeFont: class extends self.ISpriteFontInstance {},
	LoadingFont: class extends self.ISpriteFontInstance {},
	InfoFont: class extends self.ISpriteFontInstance {},
	GameInfoFont: class extends self.ISpriteFontInstance {},
	LevelInfoFont: class extends self.ISpriteFontInstance {},
	ButtonsSound: class extends self.ISpriteInstance {},
	Buttons_2Sound: class extends self.ISpriteInstance {},
	Scores: class extends self.ISpriteInstance {}
}