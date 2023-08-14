const API = 'https://api.github.com/users';

function GitHubApi() {
	const error = document.querySelector('.error');
	const form = document.querySelector('form');
	const input = document.querySelector('#input');
	const randomButton = document.querySelector('.random-button');
	const mainDiv = document.querySelector('.main');

	const loader = document.createElement('div');

	loader.classList.add('loader');

	const cyrillic = "абвгдеёжзийклмнопрстуфхцчшщъыьэюя";

	form.addEventListener('submit', (e) => {
		e.preventDefault();
		if (input.value) {
			const userName = input.value;
			fetchUser(userName);
		}
	})

	randomButton.addEventListener('click', (e) => {
		fetchRandomUser();
	})

	function showLoader() {
		const isLoader = document.querySelector('.loader');
		if (!isLoader) {
			mainDiv.innerText = '';
			mainDiv.append(loader);
		}
	}

	function hideLoader() {
		loader.remove();
	}

	async function controller(action, method = 'GET', body) {
		const params = {
			method: method,
			headers: {
				'accept': 'application/vnd.github+json',
				'X-GitHub-Api-Version': '2022-11-28',
			},
		};

		if (body) params.body = JSON.stringify(body);

		try {
			const response = await fetch(action, params);
			const data = await response.json();

			return data;
		} catch (err) {
			console.log(err);
		}
	}

	async function fetchRandomUser() {
		showLoader()
		const id = getRanodmId();
		const randomUsersData = await controller(`${API}?since=${id}?per_page=1`);
		const randomUserData = randomUsersData[0];
		const { login } = randomUserData;
		fetchUser(login)
	}

	async function fetchUser(userName) {
		showLoader();
		const data = await controller(`${API}/${userName}`);
		if (data?.message === 'Not Found') {
			mainDiv.innerText = '';
			error.innerText = 'User not found';
			return '';
		}
		error.innerText = '';
		const repositoriesData = await fetchRepositories(userName);
		hideLoader();
		renderUser(data);
		renderRepositories(repositoriesData);
	}

	function renderUser(data) {
		input.value = '';

		const cardDiv = document.createElement('div');
		const userMainInfoDiv = document.createElement('div');
		const avatarImg = document.createElement('img');
		const userNamePara = document.createElement('p');
		const userAdditionalInfoDiv = document.createElement('div');
		const bioDiv = document.createElement('div');
		const locationDiv = document.createElement('div');
		const subsDiv = document.createElement('div');

		const bio = data.bio;
		const location = data.bio;
		const followers = data.followers;

		mainDiv.innerText = '';

		cardDiv.classList.add('card');

		userMainInfoDiv.classList.add('user-main-info');

		avatarImg.src = data.avatar_url;
		avatarImg.classList.add('avatar');
		avatarImg.width = '160';
		avatarImg.height = '160';
		userMainInfoDiv.append(avatarImg);

		userNamePara.classList.add('user-name');
		userNamePara.innerText = data.login;
		userMainInfoDiv.append(userNamePara);

		cardDiv.append(userMainInfoDiv);

		userAdditionalInfoDiv.classList.add('user-additional-info');

		if (bio) {
			bioDiv.classList.add('bio');
			bioDiv.innerHTML = `<span>Biography: </span>${bio}`;
			userAdditionalInfoDiv.append(bioDiv);
		}

		if (location) {
			locationDiv.classList.add('location');
			locationDiv.innerHTML = `<span>Location: </span>${location}`;
			userAdditionalInfoDiv.append(locationDiv);
		}

		subsDiv.classList.add('subs');
		subsDiv.innerHTML = `<span>Subs: </span>${followers}`;
		userAdditionalInfoDiv.append(subsDiv);

		cardDiv.append(userAdditionalInfoDiv);

		mainDiv.append(cardDiv);

		console.log(data);
	}

	async function fetchRepositories(userName) {
		const url = `https://api.github.com/users/${userName}/repos`;
		const data = await controller(url);
		return data
	}

	function renderRepositories(repositoreis) {
		if (repositoreis.length === 0) {
			return '';
		}
		const cardDiv = document.querySelector('.card');

		const repositoreisDiv = document.createElement('div');

		repositoreisDiv.classList.add('repositories');

		repositoreis.forEach(repositoryData => {
			repositoreisDiv.append(renderRepository(repositoryData))
		});
		cardDiv.append(repositoreisDiv);
	}

	function renderRepository(repositoryData) {
		const repositoryDiv = document.createElement('div');
		const repositoryNameA = document.createElement('a');
		const repositoryStatusP = document.createElement('p');
		
		repositoryDiv.classList.add('repository');

		repositoryNameA.href = `https://github.com/${repositoryData.full_name}`
		repositoryNameA.innerText = repositoryData.name;
		repositoryStatusP.innerText = repositoryData.private ? 'Private' : 'Public';
		
		repositoryDiv.append(repositoryNameA, repositoryStatusP);
		
		return repositoryDiv;
	}

	function getRanodmId() {
		return Math.floor(Math.random() * (100000000 - 1 + 1)) + 1;
	}
}

GitHubApi();
