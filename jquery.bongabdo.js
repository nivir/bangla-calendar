(function($) {
	$.fn.bongabdo = function(options) {
		// To Do: Use the options to re-format return value
		var settings = $.extend({
			displayLanguage: "bangla",
			dayStartsAt: "sunrise",
			showSeason: false,
			showWeekDays: false,
			format: "DD MM, YY"
		}, options);

		var banglaMonthsList = ["পৌষ", "মাঘ", "ফাল্গুন", "চৈত্র", "বৈশাখ", "জ্যৈষ্ঠ", "আষাঢ়", "শ্রাবণ", "ভাদ্র", "আশ্বিন", "কার্তিক", "অগ্রহায়ণ"];
		var weekDaysList = ["রবিবার", "সোমবার", "মঙ্গলবার", "বুধবার", "বৃহস্পতিবার", "শুক্রবার", "শনিবার"];
		var banglaSeasonsList = ["শীত", "বসন্ত", "গ্রীষ্ম", "বর্ষা", "শরৎ", "হেমন্ত"];

		var midMonthDate = [13, 12, 14, 13, 14, 14, 15, 15, 15, 15, 14, 14];
		var totalMonthDays = [30, 30, 30, 30, 31, 31, 31, 31, 31, 30, 30, 30];
		var leapYearIndex = 2; //Leap Year will affect only the day count in 'Falgun'
		var lastMonthIndex = 3; //'Chaitro' is the last month and it's index is 3 in banglaMonthsList

		Date.prototype.addHours = function(h) {
			this.setHours(this.getHours() + h);
			return this;
		}

		function isLeapYear(year) {
			return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
		}

		//Bangla Year Calculation with respect to Gregorian Year
		function getBanglaYear(month, date, year) {
			var banglaYear = year - 594; //2017(Gregorian Year) - 594 = 1423(Bangla Year)
			//if the month is after 'chaitro' then it is a bangla new year, hence the year count will be one more
			if ((month > lastMonthIndex) || (month == lastMonthIndex && date > midMonthDate[lastMonthIndex]))
				banglaYear = year - 593;

			return banglaYear;
		}

		function getBanglaDateAndMonth() {
			var timeStamp = new Date().addHours(-6);
			//Year, Date, Month for Gregorian/English Calendar
			var gregDate = timeStamp.getDate(),
				gregMonth = timeStamp.getMonth(),
				gregYear = timeStamp.getFullYear(),
				gregDay = timeStamp.getDay();

			var banglaYear, banglaMonth, banglaDate, banglaSeason, banglaMonthIndex;

			banglaYear = getBanglaYear(gregMonth, gregDate, gregYear);

			if (gregDate <= midMonthDate[gregMonth]) {
				var monthDays = ((gregMonth == leapYearIndex) && isLeapYear(gregYear)) ? totalMonthDays[gregMonth] + 1 : totalMonthDays[gregMonth]; //In a leap year, for 'Falgun' month total number of Month Days will be 31 instead of 30
				banglaDate = monthDays + gregDate - midMonthDate[gregMonth];
				banglaMonthIndex = gregMonth;
				banglaMonth = banglaMonthsList[banglaMonthIndex];
			} else {
				banglaDate = gregDate - midMonthDate[gregMonth];
				banglaMonthIndex = (gregMonth + 1) % 12; //banglaMonthsList is 0-based indexed
				banglaMonth = banglaMonthsList[banglaMonthIndex];
			}

			banglaSeason = banglaSeasonsList[Math.floor(banglaMonthIndex / 2)]; // ('পৌষ' + 'মাঘ') = 'শীত'. Every consecutive two index in 'banglaMonthsList' indicates a single index in 'banglaSeasonsList'.

			return {
				"year": banglaYear,
				"date": banglaDate,
				"month": banglaMonth,
				"day": weekDaysList[gregDay],
				"season": banglaSeason
			};
		}

		String.prototype.convertDigitToBangla = function() {
			var convertToBanglaDigit = {
				'1': '১',
				'2': '২',
				'3': '৩',
				'4': '৪',
				'5': '৫',
				'6': '৬',
				'7': '৭',
				'8': '৮',
				'9': '৯',
				'0': '০'
			};

			return this.replace(/\d/g, function(match) {
				return convertToBanglaDigit[match];
			});
		};

		this.each(function() {
			var element = $(this);
			var result = getBanglaDateAndMonth();
			var dateString = settings.format;
			dateString = dateString.replace(/DD/i, result.date.toString());
			dateString = dateString.replace(/MM/i, result.month);
			dateString = dateString.replace(/YY/i, result.year.toString());

			if (settings.showWeekDays) {
				dateString = dateString.replace(/WW/i, result.day);
			}

			if (settings.showSeason) {
				dateString = dateString.replace(/SS/i, result.season);
			}

			element.html(dateString.convertDigitToBangla());
		});

		return this;
	};

}(jQuery));
