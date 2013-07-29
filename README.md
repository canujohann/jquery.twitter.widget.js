これは Twitter ウィジェットを生成する jQuery プラグインです。  
Twitter API 1.0 が非サポートになることで、既存のウィジェットが使えなくなるかもしれないという危惧があったのと、既存のウィジェットでは任意のレイアウトで生成できないもどかしさがありました。  
しかしこのプラグインは、任意のレイアウトでウィジェットを生成します。

_twitterWidget()_ にプロパティを渡すことで、ウィジェットを生成します。

## プロパティ
* screen_name: 生成したいアカウントの screen_name（ID ではありません） / 例 'twitterapi'  
* count: 表示させる最大のツイート数 / 数値 / 例 100  
* speed: 次のツイートを表示するまでの時間 / 数値 / 例 10  
* exclude_replies: リプライのツイートを排除するかどうか / true もしくは false  
* include_rts: リツイートを表示するかどうか / true もしくは false  
* reverse: 古いツイートから表示するかどうか / true もしくは false / デフォルトでは false
* dateformat: 表示する日付のフォーマット / 例 'Y / M / D h : m : s'  
* path: 'twitter.php' を設置したパス / 例 './api/'  
* src: ツイートのレイアウト  
* src.header: ヘッダ部分 / 例 "&lt;span&gt;$screen_name$&lt;/span&gt;"  
* src.body: メイン部分 / 例 "&lt;span&gt;$text$</span><span>$created_at$&lt;/span&gt;"  
* src.footer: フッタ部分 / 例 "&lt;span&gt;$logo$&lt;/span&gt;"  
* src.reply: リプライ部分 / 例 "Re:"  
* src.retweet: リツイート部分 / 例 "RT"  
* src.favorite: お気に入り部分 / 例 "&lt;img src='./images/favorite.png' alt='' title'' /&gt;"  

## 予約語
* $icon$: ユーザアイコン  
* $screen_name$: スクリーンネーム  
* $name$: 表示名  
* $description$: ユーザの詳細（「URL」が指定されている場合は、これも含む）  
* $text$: ツイート本文  
* $created_at$: ツイート日付  
* $logo$: Twitter ロゴ  
* $reply$: リプライボタン  
* $retweet$: リツイートボタン  
* $favorite$: お気に入りボタン  
* $action$: 上記の $reply$ / $retweet$ / $favorite$ を全て表示  


## 使用例
### html
	<div id="twitter"></div>

### twitter.php
Twitter API を使用するので、 _'twitter.php'_ を任意のディレクトリにアップしてください。

### jQuery
	$(function() {
		var option = {
			screen_name: 'twitterapi',
			speed: 10,
			exclude_replies: true,
			include_rts: false,
			dateformat: 'Y/M/D h:m:s',
			path: './api/',
			src: {
				header: "<div class='clearfix'><strong>$icon$</strong><span>$screen_name$</span><span>($name$)</span></div><p>$description$</p>",
				body: "<div class='tw'><span class='tw_text'>$text$</span> <span class='tw_date'>$created_at$</span><div>$action$</div></div>",
				footer: "<div class='clearfix'>$logo$<span>Twitter</span></div>",
				reply: "<img src='./reply.png' alt='' title='' />",
				retweet: "<img src='./retweet.png' alt='' title='' />",
				favorite: "<img src='./favorite.png' alt='' title='' />"
			}
		};
		$('#twitter').twitterWidget(option);
	});


このプラグインがお役に立てば幸いです。