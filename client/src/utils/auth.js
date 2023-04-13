// use this to decode a token and get the user's information out of it
import decode from 'jwt-decode';
import { setContext } from 'apollo-link-context';
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    const token = localStorage.getItem('id_token');
    // return the headers to the context so httpLink can read them
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : '',
        },
    };
});

// create a new class to instantiate for a user
class AuthService {
    // get user data
    getProfile() {
        return decode(this.getToken());
    }

    // check if user's logged in
    loggedIn() {
        // Checks if there is a saved token and it's still valid
        const token = this.getToken();
        return !!token && !this.isTokenExpired(token); // handwaiving here
    }

    // check if token is expired
    isTokenExpired(token) {
        try {
            const decoded = decode(token);
            if (decoded.exp < Date.now() / 1000) {
                return true;
            } else return false;
        } catch (err) {
            return false;
        }
    }

    getToken() {
        // Retrieves the user token from localStorage
        return localStorage.getItem('id_token');
    }

    login(idToken) {
        // Saves user token to localStorage
        localStorage.setItem('id_token', idToken);
        // create a new Apollo client with the authLink and set it as the default client
        const client = new ApolloClient({
            link: authLink.concat(new HttpLink({ uri: '/graphql' })),
            cache: new InMemoryCache(),
        });
        window.location.assign('/');
    }

    logout() {
        // Clear user token and profile data from localStorage
        localStorage.removeItem('id_token');
        // this will reload the page and reset the state of the application
        window.location.assign('/');
    }
}

export default new AuthService();
