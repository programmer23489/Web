import { scrubArgv } from '../../../../src/util/build/scrub-argv';

describe('scrubArgv()', () => {
  describe('--build-env', () => {
    it('should scrub --build-env <key=value>', () => {
      const result = scrubArgv(['foo', '--build-env', 'bar=wiz', 'baz']);
      expect(result).toEqual(['foo', '--build-env', 'REDACTED', 'baz']);
    });

    it('should scrub --build-env=<key=value>', () => {
      const result = scrubArgv(['foo', '--build-env=bar=wiz', 'baz']);
      expect(result).toEqual(['foo', '--build-env=REDACTED', 'baz']);
    });

    it('should handle --build-env without a value', () => {
      const result = scrubArgv(['foo', '--build-env']);
      expect(result).toEqual(['foo', '--build-env']);
    });

    it('should scrub -b <key=value>', () => {
      const result = scrubArgv(['foo', '-b', 'bar=wiz', 'baz']);
      expect(result).toEqual(['foo', '-b', 'REDACTED', 'baz']);
    });

    it('should scrub -b=<token>', () => {
      const result = scrubArgv(['foo', '-b=bar=wiz', 'baz']);
      expect(result).toEqual(['foo', '-b=REDACTED', 'baz']);
    });

    it('should handle -b without a value', () => {
      const result = scrubArgv(['foo', '-b']);
      expect(result).toEqual(['foo', '-b']);
    });

    it('should scrub -b from grouped short flags', () => {
      const result = scrubArgv(['foo', '-xyb', 'bar=wiz', 'baz']);
      expect(result).toEqual(['foo', '-xyb', 'REDACTED', 'baz']);
    });
  });

  describe('--env', () => {
    it('should scrub --env <key=value>', () => {
      const result = scrubArgv(['foo', '--env', 'bar=wiz', 'baz']);
      expect(result).toEqual(['foo', '--env', 'REDACTED', 'baz']);
    });

    it('should scrub --env=<key=value>', () => {
      const result = scrubArgv(['foo', '--env=bar=wiz', 'baz']);
      expect(result).toEqual(['foo', '--env=REDACTED', 'baz']);
    });

    it('should handle --env without a value', () => {
      const result = scrubArgv(['foo', '--env']);
      expect(result).toEqual(['foo', '--env']);
    });

    it('should scrub -e <key=value>', () => {
      const result = scrubArgv(['foo', '-e', 'bar=wiz', 'baz']);
      expect(result).toEqual(['foo', '-e', 'REDACTED', 'baz']);
    });

    it('should scrub -e=<token>', () => {
      const result = scrubArgv(['foo', '-e=bar=wiz', 'baz']);
      expect(result).toEqual(['foo', '-e=REDACTED', 'baz']);
    });

    it('should handle -e without a value', () => {
      const result = scrubArgv(['foo', '-e']);
      expect(result).toEqual(['foo', '-e']);
    });

    it('should scrub -e from grouped short flags', () => {
      const result = scrubArgv(['foo', '-xye', 'bar=wiz', 'baz']);
      expect(result).toEqual(['foo', '-xye', 'REDACTED', 'baz']);
    });
  });

  describe('--token', () => {
    it('should scrub --token <token>', () => {
      const result = scrubArgv(['foo', '--token', 'bar', 'baz']);
      expect(result).toEqual(['foo', '--token', 'REDACTED', 'baz']);
    });

    it('should scrub --token=<token>', () => {
      const result = scrubArgv(['foo', '--token=bar', 'baz']);
      expect(result).toEqual(['foo', '--token=REDACTED', 'baz']);
    });

    it('should handle --token without a value', () => {
      const result = scrubArgv(['foo', '--token']);
      expect(result).toEqual(['foo', '--token']);
    });

    it('should scrub -t <token>', () => {
      const result = scrubArgv(['foo', '-t', 'bar', 'baz']);
      expect(result).toEqual(['foo', '-t', 'REDACTED', 'baz']);
    });

    it('should scrub -t=<token>', () => {
      const result = scrubArgv(['foo', '-t=bar', 'baz']);
      expect(result).toEqual(['foo', '-t=REDACTED', 'baz']);
    });

    it('should handle -t without a value', () => {
      const result = scrubArgv(['foo', '-t']);
      expect(result).toEqual(['foo', '-t']);
    });

    it('should scrub -t from grouped short flags', () => {
      const result = scrubArgv(['foo', '-xyt', 'bar', 'baz']);
      expect(result).toEqual(['foo', '-xyt', 'REDACTED', 'baz']);
    });
  });
});
