const C3 = self.C3;
self.C3_GetObjectRefTable = function () {
	return [
		C3.Plugins.Sprite,
		C3.Behaviors.scrollto,
		C3.Behaviors.Rotate,
		C3.Plugins.Touch,
		C3.Plugins.Mouse,
		C3.Plugins.Spritefont2,
		C3.Plugins.XML,
		C3.Plugins.LocalStorage,
		C3.Plugins.Browser,
		C3.Plugins.AJAX,
		C3.Plugins.Audio,
		C3.Behaviors.Sin,
		C3.Behaviors.Bullet,
		C3.Plugins.System.Cnds.IsGroupActive,
		C3.Plugins.System.Cnds.OnLayoutStart,
		C3.Plugins.System.Acts.SetVar,
		C3.Plugins.Sprite.Acts.Spawn,
		C3.Plugins.Sprite.Acts.Destroy,
		C3.Plugins.Mouse.Acts.SetCursorSprite,
		C3.Plugins.System.Acts.Wait,
		C3.Plugins.Audio.Acts.Play,
		C3.Plugins.System.Cnds.CompareVar,
		C3.Plugins.System.Cnds.Every,
		C3.Plugins.System.Acts.AddVar,
		C3.Plugins.System.Acts.SubVar,
		C3.Plugins.Audio.Cnds.IsTagPlaying,
		C3.Plugins.Sprite.Cnds.CompareHeight,
		C3.Plugins.Sprite.Acts.SetHeight,
		C3.Plugins.Touch.Cnds.OnTouchStart,
		C3.Behaviors.Rotate.Acts.SetSpeed,
		C3.Behaviors.Sin.Acts.SetEnabled,
		C3.Plugins.System.Cnds.EveryTick,
		C3.Behaviors.Bullet.Acts.SetSpeed,
		C3.Plugins.Sprite.Acts.SetPosToObject,
		C3.Plugins.Sprite.Cnds.OnCreated,
		C3.Plugins.Sprite.Acts.SetAnim,
		C3.Plugins.System.Exps.choose,
		C3.Plugins.Sprite.Acts.SetInstanceVar,
		C3.Plugins.Sprite.Cnds.OnCollision,
		C3.Plugins.Sprite.Cnds.CompareInstanceVar,
		C3.Plugins.Sprite.Cnds.OnDestroyed,
		C3.Plugins.System.Exps.random,
		C3.Plugins.Sprite.Exps.LayerName,
		C3.Behaviors.Bullet.Acts.SetAngleOfMotion,
		C3.Plugins.Sprite.Acts.SetMirrored,
		C3.Plugins.System.Cnds.TriggerOnce,
		C3.Plugins.Sprite.Cnds.IsOnScreen,
		C3.Plugins.System.Cnds.Else,
		C3.Behaviors.Bullet.Cnds.CompareTravelled,
		C3.Plugins.Touch.Cnds.OnTouchObject,
		C3.Plugins.Sprite.Acts.SetPos,
		C3.Plugins.Touch.Exps.X,
		C3.Plugins.Touch.Exps.Y,
		C3.Plugins.Sprite.Cnds.CompareOpacity,
		C3.Plugins.Sprite.Acts.SetOpacity,
		C3.Plugins.Sprite.Exps.Opacity,
		C3.Plugins.Sprite.Acts.SetScale,
		C3.Plugins.Sprite.Acts.SetAngle,
		C3.Plugins.Sprite.Acts.SetSize,
		C3.Plugins.Sprite.Exps.Width,
		C3.Plugins.Sprite.Exps.Height,
		C3.Plugins.Sprite.Acts.MoveForward,
		C3.Plugins.Sprite.Acts.SetY,
		C3.Plugins.Sprite.Exps.Y,
		C3.Plugins.Spritefont2.Acts.SetText,
		C3.Plugins.Sprite.Cnds.CompareWidth,
		C3.Plugins.Sprite.Acts.SetX,
		C3.Plugins.Sprite.Acts.SetWidth,
		C3.Plugins.AJAX.Acts.SetHeader,
		C3.Plugins.AJAX.Acts.Post,
		C3.Plugins.Sprite.Exps.X,
		C3.Plugins.Sprite.Acts.RotateClockwise,
		C3.Plugins.LocalStorage.Acts.SetItem,
		C3.Plugins.LocalStorage.Acts.CheckItemExists,
		C3.Plugins.LocalStorage.Cnds.OnItemExists,
		C3.Plugins.LocalStorage.Acts.GetItem,
		C3.Plugins.LocalStorage.Cnds.OnItemGet,
		C3.Plugins.LocalStorage.Exps.ItemValue,
		C3.Plugins.Sprite.Cnds.IsAnimPlaying,
		C3.Plugins.Audio.Acts.SetSilent,
		C3.Plugins.Audio.Cnds.IsSilent,
		C3.Plugins.AJAX.Acts.Request,
		C3.Plugins.AJAX.Cnds.OnComplete,
		C3.Plugins.XML.Acts.Load,
		C3.Plugins.AJAX.Exps.LastData,
		C3.Plugins.XML.Exps.StringValue,
		C3.Plugins.Sprite.Acts.SetVisible,
		C3.Plugins.Browser.Acts.GoToURLWindow
	];
};
self.C3_JsPropNameTable = [
	{background: 0},
	{tent_side_left: 0},
	{tent_side_right: 0},
	{tent_top: 0},
	{tent_bottom: 0},
	{tent_shadow: 0},
	{game_texture: 0},
	{wave_1: 0},
	{wave_2: 0},
	{wave_3: 0},
	{wave_4: 0},
	{ScrollTo: 0},
	{element_camera: 0},
	{logo_duckshoot: 0},
	{element_wave_3: 0},
	{element_wave_1: 0},
	{element_wave_2: 0},
	{Rotate: 0},
	{game_gear_1: 0},
	{game_gear_2: 0},
	{destroy: 0},
	{ready_to_die: 0},
	{ducks: 0},
	{element_duck_destroy: 0},
	{ducks_fail: 0},
	{monster_ness_1: 0},
	{monster_ness_2: 0},
	{monster_ness_3: 0},
	{monster_ness_2a: 0},
	{Touch: 0},
	{Mouse: 0},
	{monster_octopus_1: 0},
	{monster_octopus_2: 0},
	{monster_octopus_3: 0},
	{monster_octopus_1a: 0},
	{monster_octopus_3a: 0},
	{shoot_effect_1: 0},
	{shoot_effect_2: 0},
	{shoot_hole: 0},
	{shoot_target: 0},
	{info_mais_points: 0},
	{info_menos_points: 0},
	{info_bar_bg: 0},
	{info_bar: 0},
	{info_points_txt: 0},
	{tent_courtain_left_repeat: 0},
	{tent_courtain_right_repeat: 0},
	{tent_courtain_left: 0},
	{tent_courtain_right: 0},
	{tent_courtain_tie_left: 0},
	{tent_courtain_tie_right: 0},
	{info_bt_again: 0},
	{info_record: 0},
	{share_facebook: 0},
	{share_twitter: 0},
	{info_record_txt: 0},
	{info_bt_sound: 0},
	{XML: 0},
	{LocalStorage: 0},
	{Browser: 0},
	{AJAX: 0},
	{info_record_star: 0},
	{Audio: 0},
	{Sine: 0},
	{waves: 0},
	{Bullet2: 0},
	{characters: 0},
	{characters_one_more: 0},
	{game: 0},
	{duck_now_1: 0},
	{duck_now_2: 0},
	{duck_now_3: 0},
	{jsonBody: 0},
	{game_time: 0},
	{game_points: 0},
	{game_record: 0},
	{duck_time: 0},
	{duck_speed: 0},
	{facebookShare: 0},
	{facebook_message: 0},
	{twitterShare: 0},
	{twitter_message: 0}
];

self.InstanceType = {
	background: class extends self.ISpriteInstance {},
	tent_side_left: class extends self.ISpriteInstance {},
	tent_side_right: class extends self.ISpriteInstance {},
	tent_top: class extends self.ISpriteInstance {},
	tent_bottom: class extends self.ISpriteInstance {},
	tent_shadow: class extends self.ISpriteInstance {},
	game_texture: class extends self.ISpriteInstance {},
	wave_1: class extends self.ISpriteInstance {},
	wave_2: class extends self.ISpriteInstance {},
	wave_3: class extends self.ISpriteInstance {},
	wave_4: class extends self.ISpriteInstance {},
	element_camera: class extends self.ISpriteInstance {},
	logo_duckshoot: class extends self.ISpriteInstance {},
	element_wave_3: class extends self.ISpriteInstance {},
	element_wave_1: class extends self.ISpriteInstance {},
	element_wave_2: class extends self.ISpriteInstance {},
	game_gear_1: class extends self.ISpriteInstance {},
	game_gear_2: class extends self.ISpriteInstance {},
	ducks: class extends self.ISpriteInstance {},
	element_duck_destroy: class extends self.ISpriteInstance {},
	ducks_fail: class extends self.ISpriteInstance {},
	monster_ness_1: class extends self.ISpriteInstance {},
	monster_ness_2: class extends self.ISpriteInstance {},
	monster_ness_3: class extends self.ISpriteInstance {},
	monster_ness_2a: class extends self.ISpriteInstance {},
	Touch: class extends self.IInstance {},
	Mouse: class extends self.IInstance {},
	monster_octopus_1: class extends self.ISpriteInstance {},
	monster_octopus_2: class extends self.ISpriteInstance {},
	monster_octopus_3: class extends self.ISpriteInstance {},
	monster_octopus_1a: class extends self.ISpriteInstance {},
	monster_octopus_3a: class extends self.ISpriteInstance {},
	shoot_effect_1: class extends self.ISpriteInstance {},
	shoot_effect_2: class extends self.ISpriteInstance {},
	shoot_hole: class extends self.ISpriteInstance {},
	shoot_target: class extends self.ISpriteInstance {},
	info_mais_points: class extends self.ISpriteInstance {},
	info_menos_points: class extends self.ISpriteInstance {},
	info_bar_bg: class extends self.ISpriteInstance {},
	info_bar: class extends self.ISpriteInstance {},
	info_points_txt: class extends self.ISpriteFontInstance {},
	tent_courtain_left_repeat: class extends self.ISpriteInstance {},
	tent_courtain_right_repeat: class extends self.ISpriteInstance {},
	tent_courtain_left: class extends self.ISpriteInstance {},
	tent_courtain_right: class extends self.ISpriteInstance {},
	tent_courtain_tie_left: class extends self.ISpriteInstance {},
	tent_courtain_tie_right: class extends self.ISpriteInstance {},
	info_bt_again: class extends self.ISpriteInstance {},
	info_record: class extends self.ISpriteInstance {},
	share_facebook: class extends self.ISpriteInstance {},
	share_twitter: class extends self.ISpriteInstance {},
	info_record_txt: class extends self.ISpriteFontInstance {},
	info_bt_sound: class extends self.ISpriteInstance {},
	XML: class extends self.IInstance {},
	LocalStorage: class extends self.IInstance {},
	Browser: class extends self.IInstance {},
	AJAX: class extends self.IInstance {},
	info_record_star: class extends self.ISpriteInstance {},
	Audio: class extends self.IInstance {},
	waves: class extends self.ISpriteInstance {},
	characters: class extends self.ISpriteInstance {},
	characters_one_more: class extends self.ISpriteInstance {}
}