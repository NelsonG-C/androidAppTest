'use strict';

import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  ActivityIndicator,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';

function urlForQueryAndPage(key, value, pageNumber) {
  const data = {
    country: 'uk',
    pretty: '1',
    encoding: 'json',
    listing_type: 'buy',
    action: 'search_listings',
    page: pageNumber,
  };
  data[key] = value;

  const querystring = Object.keys(data)
    .map((key) => key + '=' + encodeURIComponent(data[key]))
    .join('&');

  return 'https://api.nestoria.co.uk/api?' + querystring;
}

export class SearchPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchString: 'london',
      isLoading: false,
      message: '',
      pokelist: '',
    };
  }

  _onSearchTextChanged = (event) => {
    console.log('_onSearchTextChanged');
    this.setState({searchString: event.nativeEvent.text});
    console.log(
      'Current State:' +
        this.state.searchString +
        ', Next State: ' +
        event.nativeEvent.text,
    );
  };

  _executeQuery = async (query) => {
    console.log('query', query);
    this.setState({isLoading: true});
    const pokemonApiCall = await fetch('https://pokeapi.co/api/v2/pokemon/');
    const pokemon = await pokemonApiCall.json();
    console.log('pokemon', pokemon.results);
    this.setState({pokeList: pokemon.results, loading: false});
  };

  _onSearchPressed = () => {
    const query = urlForQueryAndPage('place_name', this.state.searchString, 1);
    this._executeQuery(query);
  };

  _handleResponse = (response) => {
    console.log('handling response');
    this.setState({isLoading: false, message: ''});
    if (response) {
      console.log('Properties found: ' + response.results);
    } else {
      this.setState({message: 'Location not recognized; please try again.'});
    }
  };

  renderItem(data) {
    return (
      <TouchableOpacity style={{backgroundColor: 'transparent'}}>
        <View style={styles.listItemContainer}>
          <Text style={styles.pokeItemHeader}>{data.item.name}</Text>
          <Image
            source={{
              uri:
                'https://res.cloudinary.com/aa1997/image/upload/v1535930682/pokeball-image.jpg',
            }}
            style={styles.pokeImage}
          />
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    const spinner = this.state.isLoading ? (
      <ActivityIndicator size="large" />
    ) : null;
    console.log('SearchPage.render');
    return (
      <View style={styles.container}>
        <Text style={styles.description}>Lookup Pokemon</Text>
        <Text style={styles.description}>Just Click Go</Text>
        <View style={styles.flowRight}>
          <TextInput
            underlineColorAndroid={'transparent'}
            style={styles.searchInput}
            placeholder="search via name or postcode"
            value={this.state.searchString}
            onChange={this._onSearchTextChanged}
          />
          <Button
            onPress={() => {}}
            color="#48bbec"
            title="Go"
            onPress={this._onSearchPressed}
          />
        </View>
        <FlatList
          data={this.state.pokeList}
          renderItem={this.renderItem}
          keyExtractor={(item) => item.name}
        />
        <Text style={styles.description}>{this.state.message}</Text>
        <Image source={require('./Resources/house.png')} style={styles.image} />
        {spinner}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  description: {
    marginBottom: 20,
    fontSize: 18,
    textAlign: 'center',
    color: '#656565',
  },
  container: {
    padding: 30,
    marginTop: 65,
    alignItems: 'center',
  },
  flowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  searchInput: {
    height: 36,
    padding: 4,
    marginRight: 5,
    flexGrow: 1,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#48BBEC',
    borderRadius: 8,
    color: '#48BBEC',
  },
  image: {
    marginTop: 5,
    width: 217,
    height: 138,
  },
  listItemContainer: {
    borderStyle: 'solid',
    borderColor: '#fff',
    borderBottomWidth: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  pokeItemHeader: {
    color: 'black',
    fontSize: 24,
  },
  pokeImage: {
    backgroundColor: 'transparent',
    height: 50,
    width: 50,
  },
});
