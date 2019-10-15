export interface ArrayItem {
  stringProp: string;
}
export default interface ExampleInterface {
  stringProp: string;
  dateProp: Date;
  nestedProp: {
    nestedString: string;
    nestedNumber: number;
  };
  arr: ArrayItem[];
  multipleBoolProp: string | boolean;
}
