/**
 * jQuery Twitter Widget v1.0.5
 * http://flugel.biz/
 *
 * Licensed under the MIT license.
 * Copyright 2012 Yutaka Imagawa
 */

var twitterWidget = {
	timer: false,
	option: {},
	items: [],
	user: {},
	init: function(option) {
		var defaults = {
			speed: 10,
			count: 100,
			exclude_replies: false,
			include_rts: true
		};
		this.option = $.extend(defaults, option);

		var url = this.option.path + 'twitter.php';
		url += '?screen_name=' + this.option.screen_name;
		url += '&count=' + this.option.count;
		if (this.option.exclude_replies) url += '&exclude_replies=true';
		if (!this.option.include_rts) url += '&include_rts=false';
		this.triggers();
		this.retrieve(url);
	},
	triggers: function() {
		$('.tw_action').live('click', function(e) {
			window.open($(this).attr('href'), 'tw_window', 'width=550, height=520, menubar=no, toolbar=no, scrollbars=yes');
			e.preventDefault();
		});
	},
	retrieve: function(url) {
		$.getJSON(url, function(json){
			twitterWidget.set(json);
		});
	},
	set: function(f) {
		this.items = [];
		for (var i = 0; i < f.length; i++) {
			var created = f[i].created_at.split(' ');
			var date = new Date(created[1] + ' ' + created[2] + ', ' + created[5] + ' ' + created[3]);
			var date = new Date(date.getTime() + 9 * 60 * 60 * 1000);
			var format = this.option.dateformat;
			this.items[this.items.length] = {
				created_at: (this.option.dateformat) ? format.replace('Y', date.getFullYear()).replace('M', this.fixFormat(date.getMonth()) + 1).replace('D', this.fixFormat(date.getDate())).replace('h', this.fixFormat(date.getHours())).replace('m', this.fixFormat(date.getMinutes())).replace('s', this.fixFormat(date.getSeconds())) : f[i].created_at,
				id: f[i].id,
				id_str: f[i].id_str,
				text: this.link.enable(f[i].text, f[i].entities),
				screen_name: f[i].user.screen_name,
				name: f[i].user.name,
				profile_image_url: f[i].user.profile_image_url
			};
		}
		this.user = {
			description: this.link.enable(f[0].user.description, f[0].user.entities.description),
			favourites: f[0].user.favourites_count,
			followers: f[0].user.followers_count,
			followings: f[0].user.friends_count,
			follow_request_sent: f[0].user.follow_request_sent,
			following: f[0].user.following,
			location: f[0].user.location,
			protected: f[0].user.protected,
			screen_name: f[0].user.screen_name,
			name: f[0].user.name,
			url: f[0].user.url
		};
		if (this.option.src.header) twitterWidget.create.init(twitterWidget.items[0], 'header');
		if (this.option.src.footer) twitterWidget.create.init(twitterWidget.items[0], 'footer');
		twitterWidget.create.init(twitterWidget.items[0], 'body');
		this.timer = setInterval(function() {
			if (twitterWidget.items.length == 0) {
				clearInterval(twitterWidget.timer);
				return false;
			}
			twitterWidget.create.init(twitterWidget.items[0], 'body');
		}, this.option.speed * 1000);
	},
	link: {
		enable: function(text, option) {
			var links = [];
			for (var i in option) {
				for (var x = 0; x < option[i].length; x++) {
					links[links.length] = {
						type: (option[i][x].text) ? 'hash' : (option[i][x].url) ? 'url' : 'mention',
						text: (option[i][x].text) ? option[i][x].text : (option[i][x].url) ? option[i][x].url : option[i][x].screen_name,
						from: option[i][x].indices[0],
						to: option[i][x].indices[1]
					};
				}
			}
			links.sort(function(a, b) {return a['from'] > b['from'] ? 1 : -1;});
			for (var i = links.length - 1; i >= 0; i--) {
				text = text.substr(0, links[i].from) + this.cut[links[i].type](links[i]) + text.substr(links[i].to);
			}
			return text;
		},
		cut: {
			hash: function(data) {
				return "<a href='https://twitter.com/search?q=%23" + data.text + "' target='_blank' title='" + data.text + "'>#" + data.text + '</a>';
			},
			url: function(data) {
				return "<a href='" + data.text + "' target='_blank' title='" + data.text + "'>" + data.text + '</a>';
			},
			mention: function(data) {
				return "<a href='https://twitter.com/" + data.text + "' target='_blank' title='" + data.text + "'>@" + data.text + '</a>';
			}
		}
	},
	fixFormat: function(num) {
		return (num < 10) ? '0' + num : num;
	},
	create: {
		data: false,
		init: function(data, mode) {
			var src = twitterWidget.option.src[mode], pos1, pos2;
			this.data = data;
			pos2 = src.lastIndexOf('$');
			while (pos2 != -1) {
				pos1 = src.lastIndexOf('$', pos2 - 1);
				var key = src.substr(pos1 + 1, pos2 - (pos1 + 1));
				pos2++;
				src = src.substr(0, pos1) + this[key]() + src.substr(pos2);

				pos2 = src.lastIndexOf('$', pos1 - 1);
			}
			if (mode != 'body') {
				$('#tw_' + mode).append(src);
			} else {
				($('#tw_body').children()[0]) ? $($('#tw_body').children()[0]).before(src) : $('#tw_body').append(src);
				$($('#tw_body').children()[0]).hide().slideDown(1000);
				twitterWidget.items.splice(0, 1);
			}
		},
		created_at: function() {
			return "<a href='https://twitter.com/" + twitterWidget.user.name + '/status/' + this.data.id_str + "' target='_blank' title='" + this.data.created_at + "'>" + this.data.created_at + '</a>';
		},
		text: function() {
			return this.data.text;
		},
		icon: function() {
			return "<a href='https://twitter.com/" + twitterWidget.user.screen_name + "' target='_blank' title='" + twitterWidget.user.screen_name + "'><img src='" + this.data.profile_image_url + "' alt='" + this.data.screen_name + "' title='" + twitterWidget.user.screen_name + "' /></a>";
		},
		screen_name: function() {
			return "<a href='https://twitter.com/" + twitterWidget.user.screen_name + "' target='_blank' title='" + twitterWidget.user.screen_name + "'>" + twitterWidget.user.screen_name + "</a>";
		},
		name: function() {
			return "<a href='https://twitter.com/" + twitterWidget.user.screen_name + "' target='_blank' title='" + twitterWidget.user.name + "'>" + twitterWidget.user.name + "</a>";
		},
		description: function() {
			return twitterWidget.user.description + ((twitterWidget.user.url) ? " <a href='" + twitterWidget.user.url + "' target='_blank' title='" + twitterWidget.user.url + "'>" + twitterWidget.user.url + "</a>" : '');
		},
		logo: function() {
			return "<a href='https://twitter.com/' target='_blank' title='Twitter'><img src='https://si0.twimg.com/a/1354664716/images/resources/twitter-bird-callout.png' alt='Twitter' title='Twitter' /></a>";
		},
		reply: function() {
			var text = (twitterWidget.option.src.reply) ? twitterWidget.option.src.reply : 'Reply';
			return "<a href='https://twitter.com/intent/tweet?in_reply_to=" + this.data.id_str + "' class='tw_action' target='_blank' title='Reply'>" + text + "</a>";
		},
		retweet: function() {
			var text = (twitterWidget.option.src.retweet) ? twitterWidget.option.src.retweet : 'Retweet';
			return (twitterWidget.user.protected) ? '' : "<a href='https://twitter.com/intent/retweet?tweet_id=" + this.data.id_str + "' class='tw_action' target='_blank' title='Retweet'>" + text + "</a>";
		},
		favorite: function() {
			var text = (twitterWidget.option.src.favorite) ? twitterWidget.option.src.favorite : 'Favorite';
			return "<a href='https://twitter.com/intent/favorite?tweet_id=" + this.data.id_str + "' class='tw_action' target='_blank' title='Favorite'>" + text + "</a>";
		},
		action: function() {
			return this.reply() + this.retweet() + this.favorite();
		}
	}
};
$.fn.extend({
	twitterWidget: function(option) {
		if (option.src.header) $(this).append("<div id='tw_header'></div>");
		$(this).append("<div id='tw_body'></div>");
		if (option.src.footer) $(this).append("<div id='tw_footer'></div>");
		twitterWidget.init(option);
		return this;
	}
});
