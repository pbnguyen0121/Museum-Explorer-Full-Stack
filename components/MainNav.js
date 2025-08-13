// my-app/components/MainNav.js
import { Navbar, Nav, Container, Form, FormControl, Button, NavDropdown } from "react-bootstrap";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { searchHistoryAtom } from "@/store";
import { isAuthenticated, getUsername, removeToken } from "@/lib/authenticate";
import { addHistory } from "@/lib/userData";

export default function MainNav() {
  const [mounted, setMounted] = useState(false);
  const [searchField, setSearchField] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);
  const router = useRouter();
  const { pathname } = router;

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  const loggedIn = isAuthenticated();
  const userName = getUsername() || "User";

  function handleSubmit(e) {
    e.preventDefault();
    if (!searchField.trim()) return;

    const queryString = `title=true&q=${searchField}`;

    (async () => {
      try {
        if (loggedIn) {
          const updated = await addHistory(queryString);
          setSearchHistory(updated || []);
        } else {
          setSearchHistory(current => [...current, queryString]);
        }
      } catch {
        setSearchHistory(current => [...current, queryString]);
      }
    })();

    router.push(`/artwork?${queryString}`);
    setSearchField("");
    setIsExpanded(false);
  }

  return (
    <Navbar bg="primary" variant="dark" expand="lg" fixed="top" expanded={isExpanded} className="navbar-dark">
      <Container>
        <Navbar.Brand
          onClick={() => { router.push('/'); setIsExpanded(false); }}
          style={{ cursor: 'pointer' }}
        >
          Phuong Bac Nguyen
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={() => setIsExpanded(prev => !prev)} />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link active={pathname === '/'} onClick={() => { router.push('/'); setIsExpanded(false); }}>Home</Nav.Link>
            <Nav.Link active={pathname === '/search'} onClick={() => { router.push('/search'); setIsExpanded(false); }}>Advanced Search</Nav.Link>
          </Nav>

          <Form className="d-flex me-3" onSubmit={handleSubmit}>
            <FormControl type="search" placeholder="Search" className="me-2"
              value={searchField} onChange={e => setSearchField(e.target.value)} />
            <Button type="submit" variant="success">Search</Button>
          </Form>

          {loggedIn ? (
            <Nav>
              <NavDropdown title={userName} id="user-dropdown" onToggle={expanded => setIsExpanded(expanded)} align="end">
                <NavDropdown.Item active={pathname === '/favourites'} onClick={() => { router.push('/favourites'); setIsExpanded(false); }}>
                  Favourites
                </NavDropdown.Item>
                <NavDropdown.Item active={pathname === '/history'} onClick={() => { router.push('/history'); setIsExpanded(false); }}>
                  Search History
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={() => { removeToken(); setIsExpanded(false); router.push('/login'); }}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          ) : (
            <Nav>
              <Nav.Link active={pathname === '/login'} onClick={() => { router.push('/login'); setIsExpanded(false); }}>
                Login
              </Nav.Link>
              <Nav.Link active={pathname === '/register'} onClick={() => { router.push('/register'); setIsExpanded(false); }}>
                Register
              </Nav.Link>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
