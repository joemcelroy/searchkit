# Pagination
The pagination component provides ability to go to next and previous page.

## Example

```jsx

import {
  Pagination,
  SearchkitComponent
} from "searchkit";

class App extends SearchkitComponent<any, any> {

  render(){
    <div>
      <Pagination/>
    </div>
  }
}
```

## Props
- `translations` *(Object)*: An object of translations you wish to override. For more information on translations see [translate](../../core/Translate.md) page.

## Translations
- `pagination.previous` - Previous
- `pagination.next` - Next
