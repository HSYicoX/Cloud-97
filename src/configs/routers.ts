import INDEX from '../pages/index.jsx';
import EDITOR from '../pages/editor.jsx';
import REPOSITORY from '../pages/repository.jsx';
import BLOG from '../pages/blog.jsx';
import PROFILE from '../pages/profile.jsx';
import REGISTER from '../pages/register.jsx';
export const routers = [{
  id: "index",
  component: INDEX
}, {
  id: "editor",
  component: EDITOR
}, {
  id: "repository",
  component: REPOSITORY
}, {
  id: "blog",
  component: BLOG
}, {
  id: "profile",
  component: PROFILE
}, {
  id: "register",
  component: REGISTER
}]