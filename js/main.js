const filmPage = document.createElement('div');
	filmPage.classList.add('filmPage');

	document.querySelector('main').insertAdjacentElement('afterbegin',filmPage);
const listBlock = document.createElement('div');
	listBlock.classList.add('listBlock');
	document.querySelector('.filmPage').insertAdjacentElement('afterbegin',listBlock);
const bestFilmList = document.createElement('select');
	bestFilmList.classList.add('best-film-list','form-control');
	document.querySelector('.listBlock').append(bestFilmList);
const select = document.createElement('select');
	select.classList.add('id-list','form-control');
	document.querySelector('.listBlock').append(select);
let page = 1, listId = 232;

let counter = -1;


class FilmPage{
	constructor(selector,pagesCount,options){
		counter ++;
		console.log(counter)
		this.el = document.querySelector(selector);
		this.itemsGrid = document.createElement('div');
		this.itemsGrid.classList.add('itemsGrid');
		this.items = options;
		this.pagesCount = pagesCount;
		let itemsHtml = this.items.options.map(i=>{
			let item = document.createElement('div');
				item.classList.add('film-item');
				item.setAttribute('data-filmId',`${i.filmId}`);
			let name = document.createElement('p');
				name.textContent = `${i.nameRu}, `;
			let rating = document.createElement('span');
				rating.textContent = `${i.rating}`;
			let year = document.createElement('span');
				year.textContent = `${i.year}`;
			let poster = document.createElement('img');
				poster.classList.add('film-item-poster');
				poster.setAttribute('src',`${i.posterUrlPreview}`);
			item.append(poster,rating,name,year);
			this.itemsGrid.insertAdjacentElement('beforeend',item);
			return item;
		}).join('');
		this.el.insertAdjacentElement('beforeend',this.itemsGrid);
		this.filmId = -1;
		this.el.addEventListener('click',event =>{
			console.log(counter)
			if((event.target.classList.contains('film-item') || event.target.classList.contains('film-item-poster')) && counter == 0){
				counter++;
				if(event.target.classList.contains('film-item')) {
					this.filmId = event.target.dataset.filmid;
				} else if(event.target.tagName === 'IMG'){
					this.filmId = event.target.parentElement.dataset.filmid;
				}
				this.open(this.filmId)
				setTimeout(()=>{
					this.addVideo(this.filmId)
				},150)
			}
		})
		if(this.pagesCount>1){
			this.pageTabs = document.createElement('div');
			this.pageTabs.classList.add('pageTabs');
			for(let i=1; i<=this.pagesCount; i++){
				let pagesTab = document.createElement('span');
				pagesTab.textContent = `${i}`;
				if(i==page) {
					pagesTab.className = 'activeTab'
				} else {
					pagesTab.classList.remove('activeTab')
				}
				
				this.pageTabs.append(pagesTab);
			}
			this.el.insertAdjacentElement('beforeend',this.pageTabs);
			let tabArr = document.querySelector('.pageTabs');
			let buttArr = document.querySelectorAll('.pageTabs span');
			tabArr.addEventListener('click',event=>{
				if(event.target.tagName == 'SPAN'){
					console.log(event.target.textContent);
					document.querySelector('.itemsGrid').remove();
					document.querySelector('.pageTabs').remove();
					page = +event.target.textContent;
					loadPage(event.target.textContent,listId);
					counter = -1;
					console.log('kkk')
					this.hideBtn(buttArr);
				}
			})
			this.hideBtn(buttArr);
		}
	}
	async open(filmId){
		let url = `https://kinopoiskapiunofficial.tech/api/v2.1/films/${filmId}`;
		fetch(url, {
			"method": "GET",
			"headers": {
				"accept": "application/json",
				"X-API-KEY": "94112792-b13e-429a-a756-505e5ab8ce22"
			}
		})
		.then((response) => {
			return response.json();
		})
		.then((promise)=>{
			return promise.data
		})
		.then(filmInfo => {
			let inf = new FilmInfo({
				info: filmInfo
			})
		})
		.catch(function(err) {
			console.log(err);
		});		
	}
	async addVideo(filmId){
		let url = `https://kinopoiskapiunofficial.tech/api/v2.1/films/${filmId}/videos`;
		fetch(url, {
			"method": "GET",
			"headers": {
				"accept": "application/json",
				"X-API-KEY": "94112792-b13e-429a-a756-505e5ab8ce22"
			}
		})
		.then((response) => {
			return response.json();
		})
		.then((promise)=>{
			return promise.trailers
		})
		.then(video => {
			if(video.length>0){
				let trail = new Video_Container({
					videos: video
				})
			}
		})
		.catch(function(err) {
			console.log(err);
		});
	}
	hideBtn(buttArr){
		for(let i=1; i<this.pagesCount-1; i++){
			if (page-3>i || page+1<i) buttArr[i].style.display = 'none';
			if (buttArr[i].classList.contains('emptyTab')){buttArr[i].remove()}
		}
		if(page-3>1){
			let emptyTab = document.createElement('span');
			emptyTab.textContent = `...`;
			emptyTab.setAttribute('disabled','disabled');
			emptyTab.className = 'emptyTab'
			buttArr[0].after(emptyTab);
		}
		if(page+1<this.pagesCount-1){
			let emptyTab = document.createElement('span');
			emptyTab.textContent = `...`;
			emptyTab.setAttribute('disabled','disabled');
			emptyTab.className = 'emptyTab'
			buttArr[this.pagesCount-1].before(emptyTab);
		}
	}

}

class FilmInfo{
	constructor(info){
		this.block = document.createElement('div');
		this.block.classList.add('block');
		this.container = document.createElement('div');
		this.container.classList.add('filmInfo');
		this.container.style.top = window.pageYOffset + 'px';
		this.container.innerHTML = '<span id="closeInfo"><i class="fas fa-times"></i></span>'
		this.info = info.info;
		let poster = document.createElement('img');
			poster.setAttribute('src',`${this.info.posterUrlPreview}`);
		let name = document.createElement('h3');
			name.textContent = `${this.info.nameRu}`;
		
		let slogan = document.createElement('h5');
		if(this.info.slogan) slogan.textContent = `${this.info.slogan}`;
		let year = document.createElement('p');
			year.innerHTML = `<span class="first-word">Год выпуска:</span> ${this.info.year}`;
		let countries = document.createElement('p');
			countries.innerHTML = `<span class="first-word">Страна:</span> ${this.info.countries.map(i=>i.country).join(', ')}`;
		let genres = document.createElement('p');
			genres.innerHTML = `<span class="first-word">Жанр:</span> ${this.info.genres.map(i=>i.genre).join(', ')}`;
		let filmLength = document.createElement('p');
			filmLength.innerHTML = `<span class="first-word">Продолжительность:</span> 0${this.info.filmLength}`;
		let premiereWorld = document.createElement('p');
			premiereWorld.innerHTML = `<span class="first-word">Премьера (мир):</span> ${new Date(this.info.premiereWorld).toLocaleDateString()} ${this.info.premiereWorldCountry}`;
		let description = document.createElement('p');
			description.textContent = `${this.info.description}`;
		this.container.append(poster,name,slogan,year,countries,genres,filmLength,premiereWorld,description);
		this.block.insertAdjacentElement("afterbegin",this.container);
		document.querySelector('.filmPage').insertAdjacentElement("afterbegin",this.block);
		this.blockBg = document.createElement('div');
		this.blockBg.classList.add('blockBg');
		document.querySelector('.block').insertAdjacentElement("afterbegin",this.blockBg);
		this.block.addEventListener('click',event =>{
			if(event.target.classList.contains('blockBg') || event.target.tagName === 'I'){
				this.block.remove();
				counter = 0;
			}
		})
	}		
}

class Video_Container{
	constructor(videos){
		this.videos = videos.videos;
		this.container = document.createElement('div');
		this.container.classList.add('videoContainer');
		document.querySelector('.filmInfo').insertAdjacentElement('beforeend',this.container);
		if(this.videos.length>1){
			this.tabs = document.createElement('ul');
			this.tabs.classList.add('videoTabs');
			for(let i=0; i<this.videos.length; i++){
				let tab = document.createElement('li');
				tab.textContent = `Трейлер ${i+1}`;
				tab.setAttribute('data-url',this.videos[i].url.replace('watch?v=','embed/'));
				this.tabs.append(tab);
				this.container.append(this.tabs);
			}
			document.querySelector('.videoTabs li:first-of-type').classList.add('activeTab')
		}
		this.videPlayer = document.createElement('div');
		this.videPlayer.classList.add('videPlayer');
		this.videPlayer.innerHTML=`<iframe  src="${this.videos[0].url.replace('watch?v=','embed/')}" frameborder="0" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen;></iframe>`;	
		this.container.append(this.videPlayer);
		this.container.addEventListener('click',event=>{
			if(event.target.tagName === 'LI'){
				document.querySelector('.filmInfo iframe').setAttribute('src',`${event.target.attributes['data-url'].nodeValue}`);
				for(let i=0; i<this.videos.length; i++){
					if(document.querySelectorAll('.videoTabs li')[i].classList.contains('activeTab')){
						document.querySelectorAll('.videoTabs li')[i].classList.remove('activeTab');
						break;
					}
				}
				event.target.className='activeTab';
			}
		})
	}
}

class BestFilmList{
	constructor(list){
		this.list = list.list;
		this.select = document.querySelector('.best-film-list')
		for(let obj of this.list){
			let option = document.createElement('option');
				option.textContent = obj.title;
				option.setAttribute('data-list',`${obj.id}`);
			this.select.append(option);
		}
		this.select.addEventListener('change',event=>{
			let elemArr = document.querySelectorAll('.id-list option');
			for(let item of elemArr){
				item.remove()
			}
			loadListId(event.target[event.target.selectedIndex].dataset.list);
			page = 1;
		})
	}
}

async function loadLists(){
	try{
		let url = `https://kinopoiskapiunofficial.tech/api/v1/collections/films?listType=BEST_FILMS_LIST`;
		let response = await fetch(url, {
			"method": "GET",
			"headers": {
				"accept": "application/json",
				"X-API-KEY": "94112792-b13e-429a-a756-505e5ab8ce22"
			}
		});
		let promise = await response.json();
		let bestFilmList = await promise.items;
		let bestFL = new BestFilmList({
			list: bestFilmList
		})
	}
	catch(err){
		console.log(err);
	}
}

class IdList{
	constructor(items){
		this.list = items.items;
		this.select = document.querySelector('.id-list')
		for(let obj of this.list){
			let option = document.createElement('option');
				option.textContent = obj.title;
				option.setAttribute('data-list-id',`${obj.id}`);
			this.select.append(option);
		}
		this.select.addEventListener('change',event=>{
			if(document.querySelector('.itemsGrid'))document.querySelector('.itemsGrid').remove();
			if(document.querySelector('.pageTabs'))document.querySelector('.pageTabs').remove();
			listId = event.target[event.target.selectedIndex].dataset.listId;
			if(counter == 0)loadPage(1,event.target[event.target.selectedIndex].dataset.listId)
			counter = -1;
			page = 1;
		})
	}
}

async function loadListId(list_Id = 1){
	try{
		let url = `https://kinopoiskapiunofficial.tech/api/v1/collections/films?listType=BEST_FILMS_LIST&listId=${list_Id}`;
		let response = await fetch(url, {
			"method": "GET",
			"headers": {
				"accept": "application/json",
				"X-API-KEY": "94112792-b13e-429a-a756-505e5ab8ce22"
			}
		});
		let promise = await response.json();
		let ListId = await promise.items;
		let idList = new IdList({
			items: ListId
		})
		listId = ListId[0].id
		if(document.querySelector('.itemsGrid'))document.querySelector('.itemsGrid').remove();
		if(document.querySelector('.pageTabs'))document.querySelector('.pageTabs').remove();
	
		await loadPage(1,listId);
	}
	catch(err){
		console.log(err);
	}
}

async function loadPage(page = 1, listId = 232){
	try{
		let url = `https://kinopoiskapiunofficial.tech/api/v2.1/films/top?type=BEST_FILMS_LIST&page=${page}&listId=${listId}`;
		let response = await fetch(url, {
			"method": "GET",
			"headers": {
				"accept": "application/json",
				"X-API-KEY": "94112792-b13e-429a-a756-505e5ab8ce22"
			}
		});
		let promise = await response.json();
		let filmList = await promise.films;
		counter = -1;
		let films = new FilmPage('.filmPage',promise.pagesCount,{
			options: filmList
		})
		
	}
	catch(err){
		console.log(err);
	}
}

loadLists()
loadListId()
// loadPage(1,232)