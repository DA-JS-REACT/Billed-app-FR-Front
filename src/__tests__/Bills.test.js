/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom'
import {fireEvent,screen, waitFor} from "@testing-library/dom"
import userEvent from '@testing-library/user-event'
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import {ROUTES, ROUTES_PATH} from "../constants/routes.js";
import Bills from "../containers/Bills"
import {localStorageMock} from "../__mocks__/localStorage.js";

import router from "../app/Router.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      //to-do write expect expression
      expect(windowIcon).toBeDefined()

    })
    // add test
    test("Then bill mail in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-mail'))
      const MailIcon = screen.getByTestId('icon-mail')
      //to-do write expect expression
      expect(MailIcon).toBeDefined()

    })
   
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a.date < b.date) ? -1 : 1)
      // const antiChrono = (a, b) => (new Date(b.date) - new Date(a.date))
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })
    describe('when employee click to add a new bill', () => {
      test("then the user sees the button add a new bill", async () => {
        document.body.innerHTML = BillsUI({ data: bills })
        await waitFor(() => screen.getByTestId('btn-new-bill'))
        const buttonNewBill = screen.getByTestId('btn-new-bill')
        expect(buttonNewBill).toHaveAttribute('type', 'button')
  
      })
      test("Then , employee click on button add new Bill", async () => {
        // const onNavigate = ROUTES_PATH['Bills']
       
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname })
        }
        Object.defineProperty(window, 'localStorage', { value: localStorageMock })
        window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee'
        }))
        const bills = new Bills({
          document , onNavigate, store : null, localStorage:window.localStorage
        })
        console.log(bills);
        document.body.innerHTML = BillsUI({ data: bills })
        const handleClickNewBills = jest.fn(() => bills.handleClickNewBill())
        const buttonNewBill = screen.getByTestId('btn-new-bill')
        buttonNewBill.addEventListener('click', handleClickNewBills)
        userEvent.click(buttonNewBill)
        expect(handleClickNewBills).toHaveBeenCalled()

      })
    

    })
   

  })
})
