import { View, Component }                from 'angular2/angular2'
import { ROUTER_DIRECTIVES, RouteConfig } from 'angular2/router'

@RouteConfig([
])

@Component({
  selector: 'app'
})

@View({
  directives: [ROUTER_DIRECTIVES],

  template: `
    <main>
      <h1>Hello!</h1>
      <router-outlet></router-outlet>
    </main>
  `
})

export class App {
}
