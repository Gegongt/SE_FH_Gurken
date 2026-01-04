export class NamedEntity {
  constructor(
    private id: number,
    private name: string
  ) {}

  getId(): number {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  setName(name: string): void {
    this.name = name;
  }
}
