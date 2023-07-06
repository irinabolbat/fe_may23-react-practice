import React, { useState } from 'react';
import './App.scss';
import classNames from 'classnames';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

export function getCategoryById(categoryId) {
  return categoriesFromServer.find(category => category.id === categoryId)
    || null;
}

export function getUserById(ownerId) {
  return usersFromServer.find(user => user.id === ownerId)
    || null;
}

export const products = productsFromServer.map(product => ({
  ...product,
  category: getCategoryById(product.categoryId),
  user: getUserById(getCategoryById(product.categoryId).ownerId),
}));

export function getProducts(goods, selectedUser, query, selectedCategory) {
  let filteredProducts = goods;

  if (query) {
    const normalizedQuery = query.toLowerCase();

    filteredProducts = filteredProducts.filter(
      product => product.name.toLowerCase().startsWith(normalizedQuery),
    );
  }

  if (selectedUser !== '') {
    filteredProducts = filteredProducts.filter(
      product => product.user.id === selectedUser,
    );
  }

  if (selectedCategory !== '') {
    filteredProducts = filteredProducts.filter(
      products.categoryId === selectedCategory,
    );
  }

  return filteredProducts;
}

export const App = () => {
  const [selectedUser, setSelecedUser] = useState('');
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const visibleProducts = getProducts(
    products,
    selectedUser,
    query,
    selectedCategory,
  );

  function resetFilters() {
    setSelecedUser('');
    setQuery('');
    setSelectedCategory('');
  }

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  key={`${user.id}-${user.name}`}
                  data-cy="FilterUser"
                  href="#/"
                  className={classNames({
                    'is-active': selectedUser === user.id,
                  })}
                  onClick={() => setSelecedUser(user.id)}
                >
                  {user.name}
                </a>
              ))}

            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={query}
                  onChange={event => setQuery(event.target.value)}
                />

                <span className="icon is-left">
                  <i
                    className="fas fa-search"
                    aria-hidden="true"
                    onClick={() => setQuery('')}
                  />
                </span>

                <span className="icon is-right">
                  {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                  <button
                    data-cy="ClearButton"
                    type="button"
                    className="delete"
                  />
                </span>
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className="button is-success mr-6 is-outlined"
                onClick={() => setSelectedCategory('')}
              >
                All
              </a>

              {categoriesFromServer.map(category => (
                <a
                  key={`${category.id}-${category.title}`}
                  data-cy="Category"
                  className="button mr-2 my-1"
                  href="#/"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.title}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={resetFilters}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {visibleProducts.length === 0 ? (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          ) : (
            <table
              data-cy="ProductTable"
              className="table is-striped is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      ID

                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Product

                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-down" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Category

                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-up" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      User

                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>
                </tr>
              </thead>

              <tbody>
                {visibleProducts.map(product => (
                  <tr data-cy="Product" key={`${product.id}-${product.name}`}>
                    <td className="has-text-weight-bold" data-cy="ProductId">
                      {product.id}
                    </td>

                    <td data-cy="ProductName">{product.name}</td>
                    <td data-cy="ProductCategory">
                      {product.category.icon}
                      -
                      {product.category.title}
                    </td>

                    <td
                      data-cy="ProductUser"
                      className={classNames({
                        'has-text-link': product.user.sex === 'm',
                        'has-text-danger': product.user.sex === 'f',
                      })}
                    >
                      {product.user.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
