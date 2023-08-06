const getUsername = document.querySelector('#user') as HTMLInputElement;
// const formSubmit = document.querySelector('#form') as HTMLFormElement;
const main_container = document.querySelector('.main_container') as HTMLElement;


// object interface
interface UserData {
    id: number;
    login: string;
    avatar_url: string;
    location: string;
    url: string
}

// reusable function
async function customFetcher<T>(url: string, options?: RequestInit): Promise<T> {
    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error(`Network response was not ok - status: ${response.status}`)
    }

    const data = await response.json();
    return data;
}

// display result cards
const showResultUi = (singleUserInfo: UserData) => {
    const { avatar_url, login, url, location, id } = singleUserInfo;
    main_container.insertAdjacentHTML(
        'beforeend',
        `
            <div class="card">
                <img src=${avatar_url} alt=${login} />
                <hr />
                <div class="card-footer">
                    <div>
                        <img src=${avatar_url} alt=${login} />
                        <h3>${login}</h3>
                    </div>
                    <a href=${url}>GitHub</a>
                </div>
            </div>
        `
    )
}

async function fetchUserData(url: string) {
    const usersInfo = await customFetcher<UserData[]>(url, {});
    for (const singleUser of usersInfo) {
        showResultUi(singleUser);
    }
}

// default function call
fetchUserData('https://api.github.com/users');


// search functionality
const search = async (e :any) => {
    e.preventDefault();
    const searchQuery = getUsername.value.toLowerCase();

    try {
        const url = 'https://api.github.com/users';
        const allUsers = await customFetcher<UserData[]>(url, {});
        const matchingUsers = allUsers.filter((user) => {
            return user.login.toLowerCase().includes(searchQuery);
        })
        main_container.innerHTML = '';

        if (matchingUsers.length === 0) {
            main_container.insertAdjacentHTML(
                'beforeend',
                `<p class="empty-msg">No matching users found.</p>`
            )
        }
        else {
            for (const singleUser of matchingUsers) {
                showResultUi(singleUser);
            }
        }

    } catch (error) {
        console.log(error);
    }
}

getUsername.addEventListener('input',search);
// formSubmit.addEventListener('submit',search);
