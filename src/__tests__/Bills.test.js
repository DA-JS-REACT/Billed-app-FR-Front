/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom'
import {screen, waitFor} from "@testing-library/dom"
import userEvent from '@testing-library/user-event'
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import {ROUTES, ROUTES_PATH} from "../constants/routes.js";
import Bills from "../containers/Bills"
import {localStorageMock} from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store"
import router from "../app/Router.js";

jest.mock("../app/store", () => mockStore)

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
    // My test
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
    // end //
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a.date < b.date) ? -1 : 1)
      // const antiChrono = (a, b) => (new Date(b.date) - new Date(a.date))
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })

    // My Test
    describe('when employee click to add a new bill or icon eye', () => {
      test("then the user sees the button add a new bill", async () => {
        document.body.innerHTML = BillsUI({ data: bills })
        await waitFor(() => screen.getByTestId('btn-new-bill'))
        const buttonNewBill = screen.getByTestId('btn-new-bill')
        expect(buttonNewBill).toHaveAttribute('type', 'button')

      })
      test("Then , employee click on button add new Bill",  () => {
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname })
        }
        Object.defineProperty(window, 'localStorage', { value: localStorageMock })
        window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee'
        }))
        const testBills = new Bills({
          document , onNavigate, store : null, localStorage:window.localStorage
        })
        document.body.innerHTML = BillsUI({ data: bills })
        const handleClickNewBills = jest.fn(() => testBills.handleClickNewBill())
        const buttonNewBill = screen.getByTestId('btn-new-bill')
        buttonNewBill.addEventListener('click', handleClickNewBills)
        userEvent.click(buttonNewBill)
        expect(handleClickNewBills).toHaveBeenCalled()

      })

      test("Then , employee click on Icon eye",  () => {

        Object.defineProperty(window, 'localStorage', { value: localStorageMock })
        window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee'
        }))
        document.body.innerHTML = BillsUI({ data: bills })
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname })
        }
        const testBills  = new Bills({
          document , onNavigate, mockStore , localStorage:window.localStorage
        })

        const iconEye = screen.getAllByTestId('icon-eye')
        const handleClickIconEyes = jest.fn(() => testBills.handleClickIconEye(iconEye[0]))
        // mock  bootstrapp's function .modal
        $.fn.modal = jest.fn();
        iconEye[0].addEventListener('click', handleClickIconEyes)
        userEvent.click(iconEye[0])
        expect(handleClickIconEyes).toHaveBeenCalled()

        const modal = screen.getByTestId('modaleFile')
        expect(modal).toBeTruthy()


      })


    })

    describe("When I navigate to bill page", () => {
      test("fetches bills from mock API GET", async () => {
        Object.defineProperty(window, 'localStorage', { value: localStorageMock })
        window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee'
        }))
        const root = document.createElement("div")
        root.setAttribute("id", "root")
        document.body.append(root)
        router()
        window.onNavigate(ROUTES_PATH.Bills)
        document.body.innerHTML = BillsUI({ data: bills })
        await waitFor(() => screen.getByText("Mes notes de frais"))
        await waitFor(() => screen.getByTestId('tbody'))
        const bodyTable = screen.getByTestId('tbody')
        expect(bodyTable).toBeTruthy()
      })
    describe("When an error occurs on API", () => {
      beforeEach(() => {
        jest.spyOn(mockStore, "bills")
        Object.defineProperty(
            window,
            'localStorage',
            { value: localStorageMock }
        )
        window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee',
          email: "a@a"
        }))
        const root = document.createElement("div")
        root.setAttribute("id", "root")
        document.body.appendChild(root)
        router()
      })
      test("fetches bills from an API and fails with 404 message error", async () => {

        mockStore.bills.mockImplementationOnce(() => {
          return {
            list : () =>  {
              return Promise.reject(new Error("Erreur 404"))
            }
          }})
        window.onNavigate(ROUTES_PATH.Bills)
        await new Promise(process.nextTick);
        const message = await screen.getByText(/Erreur 404/)
        console.log(message);
        expect(message).toBeTruthy()
      })

      test("fetches messages from an API and fails with 500 message error", async () => {

        mockStore.bills.mockImplementationOnce(() => {
          return {
            list : () =>  {
              return Promise.reject(new Error("Erreur 500"))
            }
          }})

        window.onNavigate(ROUTES_PATH.Bills)
        await new Promise(process.nextTick);
        const message = await screen.getByText(/Erreur 500/)
        expect(message).toBeTruthy()
      })
    })

    })
    // end //


  })
})
